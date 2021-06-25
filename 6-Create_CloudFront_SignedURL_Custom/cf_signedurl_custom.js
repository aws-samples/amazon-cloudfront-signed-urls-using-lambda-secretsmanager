const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager({region: process.env.awsRegion});
const crypto = require('crypto');
const replacementChars = {'+':'-', '=':'_', '/':'~'}
const getKeyFromSecretsManager = () => {
  return new Promise((resolve, reject) => {
    secretsManager.getSecretValue({SecretId: process.env.awsSecretsManagerSecretName}, (err, data) => {
    if (err) {
      console.log ("Get Secret Error", err);
      return reject(err)
    }
    console.log("Private key retrieved");
    return resolve(data.SecretString);
    });
  });
}

exports.handler = async (event, data, callback) => {

  let expiration = new Date(event.expiration)/1000|0;
  let startDateTime = new Date(event.startDateTime)/1000|0;
  let customPolicy = {
    "Statement":[
      {
        "Resource": event.baseUrl,
        "Condition":{
          "IpAddress": {
            "AWS:SourceIp": event.allowedIpAddress
          },
          "DateLessThan":{
            "AWS:EpochTime": expiration
          },
          "DateGreaterThan": {
            "AWS:EpochTime": startDateTime
          }
        }
      }
    ]
  };
  customPolicy = JSON.stringify(customPolicy);

  let encodedPolicy = new Buffer.from(customPolicy).toString("base64");
  encodedPolicy = encodedPolicy.replace(/[+=/]/g, m => replacementChars[m]);

  const signer = crypto.createSign('RSA-SHA1');
  signer.update(customPolicy);
  let signedPolicy = signer.sign(await getKeyFromSecretsManager(), 'base64');
  signedPolicy = signedPolicy.replace(/[+=/]/g, m => replacementChars[m]);

  const cfSignedUrl = `${event.baseUrl}&Policy=${encodedPolicy}&Signature=${signedPolicy}&Key-Pair-Id=${process.env.amazonCloudFrontKeyPairId}`;

  const response = {
    cfSignedUrl: cfSignedUrl
  };
  callback(null,response);
}
