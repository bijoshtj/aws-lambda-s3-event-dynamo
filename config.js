module.exports = {
  events: {
      DEL: 'ObjectRemoved:Delete',
      ADD: 'ObjectCreated:Put'
  },
  dynamo_s3_event_table: 'poc_bijosh_s3_event',
  aws_config: {
  	region: 'ap-south-1'
  },
  dev_dynamodb_end_point: 'http://localhost:8000'
};

/*exports var events = {
	DEL: 'ObjectRemoved:Delete',
	ADD: 'ObjectCreated:Put'
};

exports var dynamo_s3_event_table = 'poc_bijosh_s3_event';*/