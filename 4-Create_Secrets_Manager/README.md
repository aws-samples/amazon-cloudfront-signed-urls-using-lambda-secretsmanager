## Step 4: Create Secrets Manager

In this step you will create a secret in **AWS Secrets Manager**. Up to this point, you have used **Amazon S3** and **Amazon CloudFront**, which are AWS global services. As **AWS Secrets Manager** and **AWS Lambda** are regional services, you will need to pick an AWS **region** to use for the remainder of this sample.

### Create a Secret
1. Open the [AWS Secrets Manager Management Console](https://us-west-2.console.aws.amazon.com/secretsmanager).
2. Select an AWS **region**.
3. Choose **Store a new secret**.
4. For **Select secret type**, select **Other type of secrets**.
5. For **Specify the key/value pairs to be stored in this secret** select **Plaintext**.
6. Copy and paste the contents of the private key in the file named **private_key.pem** from previous step.
7. Choose **Next**.
8. For **Secret name**, provide a name.
9. Choose **Next**.
10. Leave rotation as **Disable automatic rotation** as checked.
11. Choose **Next**.
12. Choose **Store**.
13. Select your **Secret** to view the details.
13. Record both the **Secret name** and **Secret ARN**. You will need them for the next step.

In this step you configured **AWS Secrets Manager** to store the CloudFront private key to be consumed by a downstream client. Next you will configure an **AWS Lambda** function to generate CloudFront signed URLs. We provide steps for both CloudFront canned and custom polices.

[Step 5: Create CloudFront SignedURL with Canned Policy](../5-Create_CloudFront_SignedURL_Canned/README.md)  
[Step 6: Create CloudFront SignedURL with Custom Policy](../6-Create_CloudFront_SignedURL_Custom/README.md)
