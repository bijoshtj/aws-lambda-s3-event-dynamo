let table_name = 'pp_dev_s3_event';

module.exports = {
  events: {
      DEL: 'ObjectRemoved:Delete',
      ADD: 'ObjectCreated:Put'
  },
  dynamo_s3_event_table: table_name,
  aws_config: {
  	region: 'us-west-2'
  },
  aws_config_dev: {
  	region: 'mumbai',
  	endpoint: 'http://localhost:8000'
  },
  table_schema: {
    TableName: table_name,
    KeySchema: [
        {
            AttributeName: 'file_name',
            KeyType: 'HASH'
        }, {
            AttributeName: 'created_time',
            KeyType: 'RANGE'
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'created_time',
            AttributeType: 'N'
        },
        {
            AttributeName: 'file_name',
            AttributeType: 'S'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2
    }
  }
};
