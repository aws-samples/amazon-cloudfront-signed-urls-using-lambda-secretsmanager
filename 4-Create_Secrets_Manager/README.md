## Step 4: Create Secrets Manager

In this step we will create a secret in **AWS Secrets Manager**. Up to this point, we have used **Amazon S3**, **Amazon CloudFront**, and **Amazon IAM**, which are AWS global services. As **AWS Secrets Manager** and **AWS Lambda** are regional services, you will need to pick an AWS region.

**Note**: Use an IAM user account in this step for security best practices.

### Create a Secret
1. Log into your AWS account and navigate to the [AWS Secrets Manager Management Console](https://us-west-2.console.aws.amazon.com/secretsmanager).
2. Select an AWS region.
3. Select **Store a new secret**.
4. For **Select secret type**, select **Other type of secrets**.
5. For **Specify the key/value pairs to be stored in this secret** select **Plaintext**.
6. Copy your CloudFront private key to your clipboard and paste it into the text box.
7. Select **Next**.
8. For **Secret name**, provide a name.
9. Select **Next**.
10. Leave rotation as **Disable automatic rotation** as checked.
11. Select **Next**.
12. Select **Store**.
13. Copy both the Secret Name and the Secret ARN, which we will need for the next step.

In this step we configured **AWS Secrets Manager** to store the CloudFront private key to be consumed by a downstream client. Next we will configure an **AWS Lambda** function to generate CloudFront signed URLs. We provided steps for both CloudFront canned and custom polices.

[Step 5: Create CloudFront SignedURL with Canned Policy](../5-Create_CloudFront_SignedURL_Canned/README.md)  
[Step 6: Create CloudFront SignedURL with Custom Policy](../6-Create_CloudFront_SignedURL_Custom/README.md)
