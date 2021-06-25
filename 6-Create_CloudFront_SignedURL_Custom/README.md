## Step 6: Create CloudFront Signed URL with Custom Policy

In this step you will use **AWS Lambda** to create **Amazon CloudFront Signed URLs** with a **Custom Policy**. Click [here](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html) for detailed information about canned and custom policies.

### Create Lambda Function
1. Log into your AWS account and navigate to the [AWS Lambda Management Console](https://us-west-2.console.aws.amazon.com/lambda/home?region=us-west-2#/functions).
2. Select the same AWS **Region** that you use for **AWS Secrets Manager**.
3. Choose **Create function**.
4. Select **Author from scratch**.
5. For **Function name**, provide a name.
6. For **Runtime**, select **Node.js 12.x**.
7. For **Execution role** under **Change default execution role**, select **Create a new role with basic Lambda permissions** or **Use an existing role**.
  - For **Use an existing role** select the same role you created and updated in Step 5.
8. Select **Create functions**
9. Replace the Lambda index.js codes with the codes from `cf_signedurl_custom.js`
10. Add the following **Environmental variables** to the function:  
 - awsRegion: "us-west-2" //Replace with your Region  
 - amazonCloudFrontKeyPairId: "K2XXXXXXXXXXXX" //From Step 3  
 - awsSecretsManagerSecretName: "your_secret_name" //From Step 4
11. **Save** and **Deploy** the function
12. Skip this step if you are using the same Lambda execution role from Step 5.  
Since the newly created Lambda role does **NOT** have permission to access **AWS Secrets Manager**, you will need to update the role in [IAM](https://console.aws.amazon.com/iam) to include the permission below. The complete policy is included in `lambda_role_policy.json`. Remember to replace the Resource ARN with your Secret ARN from Step 4.
```
{
    "Effect": "Allow",
    "Action": "secretsmanager:GetSecretValue",
    "Resource": "arn:aws:secretsmanager:us-west-2:8xxxxxxxxxx6:secret:your_secret_name"
}
```
13. Before we can test the function, you will need to create a Lambda test event. For the custom policy you will need the base URL, an expiration time, a start date/time and an IP address. Create a test event as shown below, which is also included in `cf_signedurl_custom_event.json`. Replace the domain with your CloudFront FQDN. Note that we appended two dummy query strings `q1` and `q2` for illustration purpose only. You can omit the query strings, but remember to keep the trailing `?`.
```
{
  "baseUrl": "https://d1hxxxxxxxxxx.cloudfront.net/sample.html?q1=123&q2=abc",
  "expiration": "12/07/2021 12:30:30 EST",
  "startDateTime": "12/07/2020 05:00:05 PST",
  "allowedIpAddress": "0.0.0.0/0"
}
```

### Test Lambda Function
1. In the Lambda function, choose **Test** to test the function. If the function is created correctly, you will get the following response:
```
{
  "cfSignedUrl": "https://d1xxxxxxxxxxxx.cloudfront.net/sample.html?q1=123&q2=abc&Policy=eyJTdGF0Z.....YYjXcwQ__&Key-Pair-Id=APKAIUJUXXXXXXXXXXXX"
}
```
2. Copy and paste the `cfSignuredUrl` into your browser. The webpage should render as expected.

3. Next you will do a second test to demonstrate the wildcard URL feature that you can use with **Custom Policy**. Modify the test event by replacing `"sample.html"` with `"*"`. The test event should look like below:
```
{
  "baseUrl": "https://d1hxxxxxxxxxx.cloudfront.net/*?q1=123&q2=abc",
  "expiration": "12/07/2021 12:30:30 EST",
  "startDateTime": "12/07/2020 05:00:05 PST",
  "allowedIpAddress": "0.0.0.0/0"
}
```
4. Choose **Test** to generate a new Signed URL as below:
```
{
  "cfSignedUrl": "https://d1xxxxxxxxxxxx.cloudfront.net/*?q1=123&q2=abc&Policy=eyJTdGF0Z.....YYjXcwQ__&Key-Pair-Id=APKAIUJUXXXXXXXXXXXX"
}
```
5. Copy and paste the `cfSignuredUrl` into your browser. You will get an access denied error. This is expected because there is no such file `"*"` file in your Amazon S3 bucket.
6. In the browser, replace `"*"` with `"sample.html"` and hit enter. The webpage should render correctly now.
7. Let's do another test by uploading a new file `"newsample.html"` to your Amazon S3 bucket.
8. In the browser, replace `"sample.html"` with `"newsample.html"` and hit enter. The new webpage should render correctly as well.
9. Try changing the date or IP address and see how it affect the access.

With a custom policy using a wildcard `*`, you can use the signed URL with multiple files based on matching pattern. In the example above where we used an URL `"https://d1xxxxxxxxxxxx.cloudfront.net/*"`, any of the URLs below would work:

`"https://d1xxxxxxxxxxxx.cloudfront.net/anyS3object"`  
`"https://d1xxxxxxxxxxxx.cloudfront.net/path1/anyS3object"`  
`"https://d1xxxxxxxxxxxx.cloudfront.net/path1/path.../anyS3object"`  

For a more limited URL like `"https://d1xxxxxxxxxxxx.cloudfront.net/path1/*/sample.html"`, the follow URLs would render the `"sample.html"`:

`"https://d1xxxxxxxxxxxx.cloudfront.net/path1/path2/sample.html"`  
`"https://d1xxxxxxxxxxxx.cloudfront.net/path1/path2/path3/path4/sample.html"`  

In this step you configured a Lambda function to create **CloudFront Signed URLs** using a custom policy. You signed the custom policy with the CloudFront private key stored in **AWS Secrets Manager**. Now your application can generate **CloudFront Signed URLs** by accessing the Lambda function through, for example **AWS API Gateway** or **AWS AppSync**.
