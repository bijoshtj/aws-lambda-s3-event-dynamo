

const bluebird = require('bluebird');
const AWS = require('aws-sdk');
const DynamoDB = require('./dynamodb');
const config = require('./config');

let aws_config = config.aws_config;

if (process.env.NODE_ENV === 'DEVELOPMENT') {
	aws_config = config.aws_config_dev
}

console.log('Updating AWS config: ', aws_config);

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

            resp_promise
            	.then(resp => {
            		callback(null, resp);
            	})
            	.catch(err => {
            		callback('Error occured');
            	});
        });
    } else {
        callback(null, 'Hello from Lambda');
    }
};