const bluebird = require('bluebird');
const table_name = require('./config').dynamo_s3_event_table;

var ddbScanAsync, ddbPutAsync;

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

		ddbPutAsync = bluebird.promisify(doc_client.put, {context: doc_client});
		ddbScanAsync = bluebird.promisify(doc_client.scan, {context: doc_client});
		console.log('inside constructor');
	}

	addRecord (file_arn, event_time) {
		console.log('inside add record');
		return insertOrUpdate({
			file_arn: file_arn,
			created_time: event_time
		});
	}

	updateDeleteTime (file_arn, event_time) {
		return ddbScanAsync({
			TableName: table_name,
			FilterExpression : 'file_arn = :urn and attribute_not_exists(deleted_time)',
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