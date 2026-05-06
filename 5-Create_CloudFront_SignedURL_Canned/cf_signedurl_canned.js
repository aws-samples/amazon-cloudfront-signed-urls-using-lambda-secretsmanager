import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { createSign } from 'crypto';

const secretsManager = new SecretsManagerClient({ region: process.env.AWS_REGION });

// CloudFront requires base64 with these character substitutions
const toCloudFrontBase64 = (str) => str.replace(/\+/g, '-').replace(/=/g, '_').replace(/\//g, '~');

const getKeyFromSecretsManager = async () => {
  const response = await secretsManager.send(
    new GetSecretValueCommand({ SecretId: process.env.awsSecretsManagerSecretName })
  );
  console.log('Private key retrieved');
  return response.SecretString;
};

const toEpoch = (dateStr) => {
  const ts = new Date(dateStr).getTime();
  if (isNaN(ts)) throw new Error(`Invalid date: "${dateStr}". Use ISO 8601 format, e.g. "2027-12-31T12:30:30Z"`);
  return Math.floor(ts / 1000);
};

export const handler = async (event) => {
  const privateKey = await getKeyFromSecretsManager();

  const expiration = toEpoch(event.expiration);

  const cannedPolicy = JSON.stringify({
    Statement: [
      {
        Resource: event.baseUrl,
        Condition: {
          DateLessThan: {
            'AWS:EpochTime': expiration,
          },
        },
      },
    ],
  });

  const signer = createSign('RSA-SHA1');
  signer.update(cannedPolicy);
  const signature = toCloudFrontBase64(signer.sign(privateKey, 'base64'));

  const paramDelimiter = event.baseUrl.includes('?') ? '&' : '?';
  const cfSignedUrl = `${event.baseUrl}${paramDelimiter}Expires=${expiration}&Signature=${signature}&Key-Pair-Id=${process.env.amazonCloudFrontKeyPairId}`;

  return { cfSignedUrl };
};
