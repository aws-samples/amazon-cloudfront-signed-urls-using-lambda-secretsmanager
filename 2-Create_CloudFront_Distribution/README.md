## Step 2: Create Amazon CloudFront Distribution

In this step we will create an Amazon CloudFront distribution with your Amazon S3 bucket created in Step 1 as source. We will also restrict access to the bucket by using an [Origin Access Identity (OAI)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html).

**Note**: Use an IAM user account in this step for security best practices.

### Create Distribution
1. Log into your AWS account and navigate to the [Amazon CloudFront Management Console](https://console.aws.amazon.com/cloudfront).
2. Select **Create Distribution**.
3. Under Web, select **Get Started**.
4. For **Origin Domain Name** select your Amazon S3 Bucket from Step 1.
5. For **Restrict Bucket Access** select **Yes**.
6. For **Origin Access Identity** select **Create a New Identity**.
7. For **Grant Read Permissions on Bucket** select **Yes, Update Bucket Policy**. This will automatically add an Amazon Bucket policy to the your bucket allowing only this CloudFront distribution to read from the bucket.
8. Leave everything else as default and select **Create Distribution**.
9. In the distribution details screen, note the **Distribution Status**. Wait for the status to change from **In Progress** to **Deployed**. It can take upward of 5 minutes for the process to complete.
10. Under **Domain Name** copy the FQDN, similar to `dxxxxxxxxxz.cloudfront.net`.

### Test Public Distribution
We want to test to verify that the distribution is setup correctly and has access to the Amazon S3 contents.

Use your browser and enter the URL https://dxxxxxxxxxz.cloudfront.net/sample.html. Remember to replace the domain name with your FQDN. Your sample webpage should come up correctly. However, anyone with your URL can access your Amazon S3 contents.

### Secure Distribution
Next we want to secure the Amazon CloudFront distribution to restrict public access.
1. Select the **Distribution ID** to open the detail view.
2. Select the **Behaviors** tab.
3. Checkbox the default **Origin or Origin Group** and select **Edit**.
4. Under **Restrict Viewer Access (Use Signed URLs or Signed Cookies)** select **Yes** to expand the **Trusted Key Groups or Trusted Signer** option.
5. Under **Trusted Key Groups or Trusted Sign**, select **Trusted Signer**.
6. Under **Trusted Signers** select **Self** if you are using the same AWS Account for both the CloudFront distribution and the CloudFront key pair, which we will create in the next step. Select **Specify Accounts** and enter the account number of another AWS Account that you will be using to create the CloudFront key pair.
7. Select **Yes, Edit** to save the changes.

### Test Secured Distribution
Now we want to test to verify that the distribution is restricted. Refresh the webpage and you should see the error message:
> Missing Key-Pair-Id query parameter or cookie value

In this step we created an Amazon CloudFront distribution to distribute your Amazon S3 private contents. We then secured the distribution by using the **Restrict Viewer Access** option.  

In [Step 3](../3-Create_CloudFront_Keypair/README.md), we will create the **CloudFront Key Pair**
