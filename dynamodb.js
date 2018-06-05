let config = require('./config');

const bluebird = require('bluebird');
const table_name = config.dynamo_s3_event_table;

var ddbScanAsync, ddbPutAsync, ddbDescribeTableAsync, ddbCreateTableAsync;

let insertOrUpdate = function (params) {
	console.log(params);
	return ddbPutAsync({
		TableName: table_name,
		Item: params
	})
	.return(true);
};


module.exports = class DynamoDB {
	constructor (AWS) {
		let doc_client = new AWS.DynamoDB.DocumentClient();
		let ddb_obj = new AWS.DynamoDB();

		ddbPutAsync = bluebird.promisify(doc_client.put, {context: doc_client});
		ddbScanAsync = bluebird.promisify(doc_client.scan, {context: doc_client});


		ddbDescribeTableAsync = bluebird.promisify(ddb_obj.describeTable, {context: ddb_obj});
		ddbCreateTableAsync = bluebird.promisify(ddb_obj.createTable, {context: ddb_obj});


		console.log('inside constructor');
	}

	initialize () {

		return ddbDescribeTableAsync({
				TableName: table_name
			})
			.catch(err => {
				console.log('ddb describe error', err);
				if (err && err.code === 'ResourceNotFoundException') {
					return false;
				} else {
					throw err;
				}
			})
			.then(resp => {
				if (resp) {
					console.log('table already exists....')
					return true;
				} else {
					console.log('CReating table .......')
					return ddbCreateTableAsync(config.table_schema);
				}
			})
			.return(true)
			.catch(err => {
				console.log('error loading table', err);
				return false;
			});
	}

	addRecord (file_arn, event_time) {
		console.log('inside add record');
		return insertOrUpdate({
			file_name: file_arn,
			created_time: event_time
		});
	}

	updateDeleteTime (file_arn, event_time) {
		return ddbScanAsync({
			TableName: table_name,
			FilterExpression : 'file_name = :urn and attribute_not_exists(deleted_time)',
			ExpressionAttributeValues: {
				':urn': file_arn
			}
		})
		.then(resp => {
			let record_count = resp.Items && resp.Items.length;

			if (record_count > 0) {
				let record = resp.Items[0];

				record.deleted_time = event_time;

				return insertOrUpdate(record);
			}

			return false;
		});
	}
}
