var index = require('./index');

var create_data = {
  "Records": [
    {
      "eventVersion": "2.0",
      "eventSource": "aws:s3",
      "awsRegion": "ap-south-1",
      "eventTime": "2018-05-17T06:49:53.717Z",
      "eventName": "ObjectCreated:Put",
      "userIdentity": {
        "principalId": "AWS:AIDAJE6TZYLWENPBK3OAE"
      },
      "requestParameters": {
        "sourceIPAddress": "182.76.162.174"
      },
      "responseElements": {
        "x-amz-request-id": "9BB13C3DD4278F55",
        "x-amz-id-2": "R7XMDjBNavB9OLAOjT1HXZK/z3Eoxqn63eFUhOKUZA+N3Nj13uKM+UpKx0RK9Nrcefn2qrAkovA="
      },
      "s3": {
        "s3SchemaVersion": "1.0",
        "configurationId": "e9dfdd6d-7b06-4638-b78c-3c6c0894ff67",
        "bucket": {
          "name": "poc-bijoshtj",
          "ownerIdentity": {
            "principalId": "A350J4COOJWOEF"
          },
          "arn": "arn:aws:s3:::poc-bijoshtj"
        },
        "object": {
          "key": "bengaluru/2018/05/s3_test.json",
          "size": 28,
          "eTag": "ada5f1f8cf56cb09f7b0b8f19ad89a20",
          "sequencer": "005AFD2611ABF9E287"
        }
      }
    }
  ]
};

let delete_data = {
  "Records": [
    {
      "eventVersion": "2.0",
      "eventSource": "aws:s3",
      "awsRegion": "ap-south-1",
      "eventTime": "2018-05-17T07:30:49.790Z",
      "eventName": "ObjectRemoved:Delete",
      "userIdentity": {
        "principalId": "AWS:AIDAJE6TZYLWENPBK3OAE"
      },
      "requestParameters": {
        "sourceIPAddress": "52.95.72.42"
      },
      "responseElements": {
        "x-amz-request-id": "5121814B71405339",
        "x-amz-id-2": "xLHwE+AyFz24EF/FmFrvx/kdlR9ThqN0EOCzK/DSIBWhqQn4MtMNbK+wdOd4jYlzsXAC63EHzE8="
      },
      "s3": {
        "s3SchemaVersion": "1.0",
        "configurationId": "acca37e8-ba8f-4d87-a3c0-5ddaa12e9be8",
        "bucket": {
          "name": "poc-bijoshtj",
          "ownerIdentity": {
            "principalId": "A350J4COOJWOEF"
          },
          "arn": "arn:aws:s3:::poc-bijoshtj"
        },
        "object": {
          "key": "bengaluru/2018/05/s3_test.json",
          "sequencer": "005AFD2FA9C1CA4963"
        }
      }
    }
  ]
};

index.handler(delete_data, {}, function (err, success) {
	if (err) {
		console.log('error occured', err);
	} else {
		console.log('success message: ', success);
	}
});