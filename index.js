

const bluebird = require('bluebird');
const AWS = require('aws-sdk');
const DynamoDB = require('./dynamodb');
const config = require('./config');

let aws_config = config.aws_config;

if (process.env.NODE_ENV === 'DEVELOPMENT') {
	aws_config.region = 'mumbai';
	aws_config.endpoint = config.dev_dynamodb_end_point;
}

console.log('Updating AWS config: ', aws_config);
/*AWS.config.update({
	region: 'mumbai',
	endpoint: 'http://localhost:8000'
});*/
AWS.config.update(aws_config);
let dynamo_db = new DynamoDB(AWS);


exports.handler = (event, context, callback) => {
    console.log('in first line');
    
    let tracked_events = config.events;
    
    if (event && event.Records) {
        console.log('before for loop');
        event.Records.forEach(curr => {
            console.log('Inside forloop');
            let resp_promise = null;

            let event_name = curr.eventName;
            let event_time = Date.parse(curr.eventTime);
            let s3_obj = curr.s3 || {};
            let bucket_obj = s3_obj.bucket || {};
            let data_obj = s3_obj.object || {};
            let file_arn = bucket_obj.arn + '/' + data_obj.key;
            
            if (event_name === tracked_events.ADD) {
            	resp_promise = dynamo_db.addRecord(file_arn, event_time)
            		.return("Inserted Successfully");
            } else if (event_name === tracked_events.DEL) {
            	console.log(file_arn);
            	resp_promise = dynamo_db.updateDeleteTime(file_arn, event_time)
            		.then(resp => {
            			return resp ? 'Updated successfully' : 'No record to update';
            		});
            } else {
            	resp_promise = bluebird.reject('Unsupported action');
            }

console.log('hu huuuu');
            resp_promise
            	.then(resp => {
            		callback(null, resp);
            	})
            	.catch(err => {
            		callback(err);
            		//callback('Error occured');
            	});
        });
    } else {
        callback(null, 'Hello from Lambda');
    }
};

/*exports.handler = (event, context, callback) => {
    console.log('in first line');
    
    let ddbCreateRecordAsync = bluebird.promisify((new AWS.DynamoDB()).putItem);
    let ddbUpdateRecordAsync = bluebird.promisify((new AWS.DynamoDB.DocumentClient();

    let ddbCreateRecord = 
    
    var tracked_events = config.events;
    
    if (event && event.Records) {
        console.log('before for loop');
        event.Records.forEach(curr => {
            console.log('Inside forloop');
            var event_name = curr.eventName;
            var event_time = Date.parse(curr.eventTime);
            var s3_obj = curr.s3 || {};
            var bucket_obj = s3_obj.bucket || {};
            var data_obj = s3_obj.object || {};
            var file_arn = bucket_obj.arn + '/' + data_obj.key;
            
            if (event_name === tracked_events.ADD) {
                var params = {
                    TableName: config.dynamo_s3_event_table,
                    Item: {
                        created_time: {
                            N: ""+event_time
                        },
                        file_name: {
                            S: file_arn
                        }
                    }
                };
                
                console.log('Inserting data: ', JSON.stringify(params));
                ddb.putItem(params, (err, data) => {
                    if (err) {
                        callback(JSON.stringify(err));
                    } else {
                        callback(null, "Inserted successfully")
                    }
                });
            } else if (event_name === tracked_events.DEL) {
                
                console.log('file urn: ', file_arn);
                var params = {
                    TableName: config.dynamo_s3_event_table,
                    FilterExpression : 'file_name = :urn and attribute_not_exists(deleted_time)',
                    ExpressionAttributeValues: {
                        ':urn': file_arn
                    }
                };
                
                doc_client.scan(params, (err, resp) => {
                    if (err) {
                        console.log("Error retrieving data", err);
                        callback('Error occured on fetching data');
                    } else if (resp.Items && resp.Items.length > 0) {
                        console.log('query response is: ', JSON.stringify(resp));
                        var curr_item = resp.Items[0];
                        
                        curr_item.deleted_time = event_time;
                        
                        doc_client.put({
                                TableName: config.dynamo_s3_event_table,
                                Item: curr_item
                            }, (err, resp) => {
                            if (err) {
                                console.log(err);
                                callback('Error updating record');
                            } else {
                                callback(null, 'updated delete event successfully');
                            }
                        });
                    } else {
                        callback(null, 'No record exists to update');
                    }
                });
                
            } else {
                callback('Unsupported action');
            }
        });
    } else {
        callback(null, 'Hello from Lambda');
    }
};*/