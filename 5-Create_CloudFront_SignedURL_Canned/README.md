## Step 5: Create CloudFront Signed URL with Canned Policy

In this step we will use **AWS Lambda** to create **Amazon CloudFront Signed URLs** with a **Canned Policy**. Click [here](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html) for detailed information about canned and custom policies.

**Note**: Use an IAM user account in this step for security best practices.

### Create Lambda Function
1. Log into your AWS account and navigate to the [AWS Lambda Management Console](https://us-west-2.console.aws.amazon.com/lambda/home?region=us-west-2#/functions).
2. Select an AWS region.
3. Select **Create function**.
4. Select **Author from scratch**.
5. For **Function name**, provide a name.
6. For **Runtime**, select **Node.js 12.x**.
7. For **Execution role**, select **Create a new role with basic Lambda permissions**.
8. Select **Create functions**.
9. Replace the Lambda index.js codes with the codes from `cf_signedurl_canned.js`.
10. Add the following **Environmental variables** to the function:  
awsRegion: "us-west-2" //Replace with your Region  
amazonCloudFrontKeyPairId: "APKAIUJUXXXXXXXXXXXX" //From Step 3  
awsSecretsManagerSecretName: "your_secret_name" //From Step 4
11. **Save** and **Deploy** the function.
12. Since the newly created Lambda role does **NOT** have permission to access **AWS Secrets Manager**, you will need to update the role in [IAM](https://console.aws.amazon.com/iam) to include the permission below. The complete policy is included in `lambda_role_policy.json`. Remember to replace the Resource ARN with your Secret ARN from Step 4.
```
{
    "Effect": "Allow",
    "Action": "secretsmanager:GetSecretValue",
    "Resource": "arn:aws:secretsmanager:us-west-2:8xxxxxxxxxx6:secret:your_secret_name"
}
```
13. Before we can test the function, you will need to create a Lambda test event. For the canned policy you will need a base URL and an expiration time. Create a sample test event as shown below, which is also included in `cf_signedurl_canned_event.json`. Replace the domain with your CloudFront FQDN. Note that we appended two dummy query strings `q1` and `q2` for illustration purpose only.
```
{
  "baseUrl": "https://d1hxxxxxxxxxx.cloudfront.net/sample.html?q1=123&q2=abc",
  "expiration": "12/12/2021 12:30:30 EST"
}
```

### Test Lambda Function
1. In the Lambda function, click **Test** to test the function. If the function is created correctly, you should get the following response:
```
{
  "cfSignedUrl": "https://d1hxxxxxxxx.cloudfront.net/sample.html?q1=123&q2=abc&Expires=1639330230&Signature=mwa~5jyg-5G.....YYjXcwQ__&Key-Pair-Id=APKAIUJUXXXXXXXXXXXX"
}
```
2. Copy the `cfSignuredUrl` and paste it into your browser. The webpage should render as expected.

3. Try changing the expiration date to earlier than **now** date and you should see an access denied message.

In this step we configured a Lambda function to create **CloudFront Signed URLs** using a canned policy. We signed the canned policy with the CloudFront private key stored in **AWS Secrets Manager**. Now your application can generate **CloudFront Signed URLs** by invoking the Lambda function through, for example **AWS API Gateway** or **AWS AppSync**.

[Step 6: Create CloudFront SignedURL with Custom Policy](../6-Create_CloudFront_SignedURL_Custom/README.md)
