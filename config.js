module.exports = {
  events: {
      DEL: 'ObjectRemoved:Delete',
      ADD: 'ObjectCreated:Put'
  },
  dynamo_s3_event_table: 'poc_bijosh_s3_event',
  aws_config: {
  	region: 'ap-south-1'
  },
  aws_config_dev: {
  	region: 'mumbai',
  	endpoint: 'http://localhost:8000'
  }
};