## Step 5: Create CloudFront Signed URL with Canned Policy

In this step you will use **AWS Lambda** to create **Amazon CloudFront Signed URLs** with a **Canned Policy**. Click [here](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html) for detailed information about canned and custom policies.

### Create Lambda Function
1. Log into your AWS account and navigate to the [AWS Lambda Management Console](https://console.aws.amazon.com/lambda).
2. Select the same AWS **Region** that you used for **AWS Secrets Manager**.
3. Choose **Create function**.
4. Select **Author from scratch**.
5. For **Function name**, provide a name.
6. For **Runtime**, select **Node.js 24.x**, then **Create function**.
7. In the **Code source** editor, replace the contents of `index.mjs` with the code from `cf_signedurl_canned.js`.
8. Choose **Deploy**.

### Configure Environment Variables
1. Choose **Configuration**.
2. Choose **Environmental variables** on the left side bar.

Add the following **Environment variables** to the function (under **Configuration > Environment variables**):

| Key | Value |
|-----|-------|
| `amazonCloudFrontKeyPairId` | `K2XXXXXXXXXXXX` *(from Step 3)* |
| `awsSecretsManagerSecretName` | `your_secret_name` *(from Step 4)* |

> **Note:** The region is automatically provided by the Lambda runtime via the built-in `AWS_REGION` environment variable. You do not need to set it manually.

### Update the Lambda Execution Role
1. 1. Choose **Configuration**.
2. Choose **Permissions** on the left side bar.
3. Choose **role** under **Role name** which opens ***AWS IAM Management Console**

The Lambda execution role does **not** have permission to access **AWS Secrets Manager** by default. Update the role  to include the permission below. The complete policy is included in `lambda_role_policy.json`. Remember to replace the Resource ARN with your Secret ARN from Step 4.
```json
{
    "Effect": "Allow",
    "Action": "secretsmanager:GetSecretValue",
    "Resource": "arn:aws:secretsmanager:us-west-2:123456789012:secret:your_secret_name"
}
```

### Create a Test Event
Before you can test the function, create a test event. For the canned policy you need a base URL and an expiration time. Create a sample test event as shown below, which is also included in `cf_signedurl_canned_event.json`. Replace the domain with your CloudFront FQDN and set the expiration to a future date. Note that the two dummy query strings `q1` and `q2` are for illustration only — you can omit them, but keep the trailing `?`.
```json
{
  "baseUrl": "https://d1hxxxxxxxxxx.cloudfront.net/sample.html?q1=123&q2=abc",
  "expiration": "2027-12-31T12:30:30Z"
}
```

> **Note:** Dates must be in ISO 8601 format (`YYYY-MM-DDTHH:MM:SSZ`). Timezone abbreviations like `EST` or `PST` are not supported by Node.js and will cause an error.

### Test Lambda Function
1. In the Lambda function, choose **Test** to test the function. If the function is configured correctly, you should get the following response:
```json
{
  "cfSignedUrl": "https://d1hxxxxxxxx.cloudfront.net/sample.html?q1=123&q2=abc&Expires=1830369030&Signature=mwa~5jyg-5G.....YYjXcwQ__&Key-Pair-Id=K2XXXXXXXXXXXX"
}
```
2. Copy and paste the `cfSignedUrl` into your browser. The webpage should render as expected.

3. Try changing the expiration date to a time in the past and you should see an access denied message.

In this step you configured a Lambda function to create **CloudFront Signed URLs** using a canned policy. You signed the canned policy with the CloudFront private key stored in **AWS Secrets Manager**. Now your application can generate **CloudFront Signed URLs** by invoking the Lambda function through, for example, **AWS API Gateway** or **AWS AppSync**.

[Step 6: Create CloudFront SignedURL with Custom Policy](../6-Create_CloudFront_SignedURL_Custom/README.md)
