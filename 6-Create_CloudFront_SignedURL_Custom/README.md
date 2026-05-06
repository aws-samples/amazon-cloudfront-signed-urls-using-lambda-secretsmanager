## Step 6: Create CloudFront Signed URL with Custom Policy

In this step you will use **AWS Lambda** to create **Amazon CloudFront Signed URLs** with a **Custom Policy**. Click [here](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html) for detailed information about canned and custom policies.

### Create Lambda Function
1. Log into your AWS account and navigate to the [AWS Lambda Management Console](https://console.aws.amazon.com/lambda).
2. Select the same AWS **Region** that you used for **AWS Secrets Manager**.
3. Choose **Create function**.
4. Select **Author from scratch**.
5. For **Function name**, provide a name.
6. For **Runtime**, select **Node.js 24.x**, then **Create function**.
   - If reusing the execution role from Step 5, choose **Configuration > Permissions** after the function is created and update the role there.
7. In the **Code source** editor, replace the contents of `index.mjs` with the code from `cf_signedurl_custom.js`.
8. Choose **Deploy**.

### Configure Environment Variables
1. Choose **Configuration**.
2. Choose **Environment variables** on the left side bar.

Add the following **Environment variables** to the function:

| Key | Value |
|-----|-------|
| `amazonCloudFrontKeyPairId` | `K2XXXXXXXXXXXX` *(from Step 3)* |
| `awsSecretsManagerSecretName` | `your_secret_name` *(from Step 4)* |

> **Note:** The region is automatically provided by the Lambda runtime via the built-in `AWS_REGION` environment variable. You do not need to set it manually.

### Update the Lambda Execution Role
1. Choose **Configuration**.
2. Choose **Permissions** on the left side bar.
3. Choose the role under **Role name**, which opens the **AWS IAM Management Console**.

Skip this step if you are reusing the same Lambda execution role from Step 5.

The Lambda execution role does **not** have permission to access **AWS Secrets Manager** by default. Update the role to include the permission below. The complete policy is included in `lambda_role_policy.json`. Remember to replace the Resource ARN with your Secret ARN from Step 4.
```json
{
    "Effect": "Allow",
    "Action": "secretsmanager:GetSecretValue",
    "Resource": "arn:aws:secretsmanager:us-west-2:123456789012:secret:your_secret_name"
}
```

### Create a Test Event
Before you can test the function, create a Lambda test event. For the custom policy you need a base URL, an expiration time, a start date/time, and an IP address. Create a test event as shown below, which is also included in `cf_signedurl_custom_event.json`. Replace the domain with your CloudFront FQDN and set the dates to valid future/past values. Note that the two dummy query strings `q1` and `q2` are for illustration only — you can omit them, but keep the trailing `?`.
```json
{
  "baseUrl": "https://d1hxxxxxxxxxx.cloudfront.net/sample.html?q1=123&q2=abc",
  "expiration": "2027-12-31T12:30:30Z",
  "startDateTime": "2026-01-01T00:00:00Z",
  "allowedIpAddress": "0.0.0.0/0"
}
```

> **Note:** Dates must be in ISO 8601 format (`YYYY-MM-DDTHH:MM:SSZ`). Timezone abbreviations like `EST` or `PST` are not supported by Node.js and will cause an error.

### Test Lambda Function
1. In the Lambda function, choose **Test** to test the function. If the function is configured correctly, you will get the following response:
```json
{
  "cfSignedUrl": "https://d1xxxxxxxxxxxx.cloudfront.net/sample.html?q1=123&q2=abc&Policy=eyJTdGF0Z.....YYjXcwQ__&Key-Pair-Id=K2XXXXXXXXXXXX"
}
```
2. Copy and paste the `cfSignedUrl` into your browser. The webpage should render as expected.

3. Next you will do a second test to demonstrate the wildcard URL feature available with **Custom Policy**. Modify the test event by replacing `"sample.html"` with `"*"`. The test event should look like below:
```json
{
  "baseUrl": "https://d1hxxxxxxxxxx.cloudfront.net/*?q1=123&q2=abc",
  "expiration": "2027-12-31T12:30:30Z",
  "startDateTime": "2026-01-01T00:00:00Z",
  "allowedIpAddress": "0.0.0.0/0"
}
```
4. Choose **Test** to generate a new Signed URL:
```json
{
  "cfSignedUrl": "https://d1xxxxxxxxxxxx.cloudfront.net/*?q1=123&q2=abc&Policy=eyJTdGF0Z.....YYjXcwQ__&Key-Pair-Id=K2XXXXXXXXXXXX"
}
```
5. Copy and paste the `cfSignedUrl` into your browser. You will get an access denied error. This is expected because there is no file literally named `"*"` in your Amazon S3 bucket.
6. In the browser, replace `"*"` with `"sample.html"` and hit enter. The webpage should render correctly.
7. Upload the included `"newsample.html"` file to your Amazon S3 bucket.
8. In the browser, replace `"sample.html"` with `"newsample.html"` and hit enter. The new webpage should render correctly as well.
9. Try changing the date or IP address and observe how it affects access.

With a custom policy using a wildcard `*`, you can use the signed URL with multiple files based on a matching pattern. In the example above where we used the URL `"https://d1xxxxxxxxxxxx.cloudfront.net/*"`, any of the URLs below would work:

`"https://d1xxxxxxxxxxxx.cloudfront.net/anyS3object"`  
`"https://d1xxxxxxxxxxxx.cloudfront.net/path1/anyS3object"`  
`"https://d1xxxxxxxxxxxx.cloudfront.net/path1/path.../anyS3object"`  

For a more specific URL like `"https://d1xxxxxxxxxxxx.cloudfront.net/path1/*/sample.html"`, the following URLs would render `"sample.html"`:

`"https://d1xxxxxxxxxxxx.cloudfront.net/path1/path2/sample.html"`  
`"https://d1xxxxxxxxxxxx.cloudfront.net/path1/path2/path3/path4/sample.html"`  

In this step you configured a Lambda function to create **CloudFront Signed URLs** using a custom policy. You signed the custom policy with the CloudFront private key stored in **AWS Secrets Manager**. Now your application can generate **CloudFront Signed URLs** by accessing the Lambda function through, for example, **AWS API Gateway** or **AWS AppSync**.
