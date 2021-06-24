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
    console.log("Secret Data", data.SecretString);
    return resolve(data.SecretString);
    });
  });
}

exports.handler = async (event, data, callback) => {

  let expiration = new Date(event.expiration)/1000|0;
  let cannedPolicy = {
    "Statement":[
      {
        "Resource": event.baseUrl,
        "Condition":{
          "DateLessThan":{
            "AWS:EpochTime": expiration
          }
        }
      }
    ]
  };
  cannedPolicy = JSON.stringify(cannedPolicy);

  let encodedPolicy = new Buffer.from(cannedPolicy).toString("base64");
  encodedPolicy = encodedPolicy.replace(/[+=/]/g, m => replacementChars[m]);

  const signer = crypto.createSign('RSA-SHA1');
  signer.update(cannedPolicy);
  let signedPolicy = signer.sign(await getKeyFromSecretsManager(), 'base64');
  signedPolicy = signedPolicy.replace(/[+=/]/g, m => replacementChars[m]);

  const cfSignedUrl = `${event.baseUrl}&Expires=${expiration}&Signature=${signedPolicy}&Key-Pair-Id=${process.env.amazonCloudFrontKeyPairId}`;

  const response = {
    cfSignedUrl: cfSignedUrl
  };
  callback(null,response);
}
