## Step 2: Create Amazon CloudFront Distribution

In this step you will create an Amazon CloudFront distribution with your Amazon S3 bucket created in Step 1 as source. You will also restrict access to the bucket by using an [Origin Access Identity (OAI)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html).

### Create Distribution
1. Log into your AWS account and navigate to the [Amazon CloudFront Management Console](https://console.aws.amazon.com/cloudfront).
2. Choose **Create Distribution**.
3. Under Web, choose **Get Started**.
4. For **Origin Domain Name** choose your Amazon S3 Bucket from Step 1.
5. For **Origin access** choose **Origin access control settings**.
6. For **Origin access control** choose **Create control setting**.
7. For **Signing behavior** choose **Sign requests**. Leave **Do not override authorization header** unchecked. Choose **Create** to continue.
8. Leave everything else as default and choose **Create Distribution**.
9. In the distribution view, choose **Origins** tab.
10. In the **Origins** tab, select the origin you just created and choose **Edit**.
11. In the **Edit origin** view, choose **Copy policy** to copy the S3 bucket policy to your clipboard.
12. Add the S3 bucket policy to your S3 bucket.
13. In the distribution details screen, note the **Distribution Status**. Wait for the status to change from **In Progress** to **Deployed**. It can take upward of 5 minutes for the process to complete.
14. Under **Domain Name** copy the FQDN, similar to `dxxxxxxxxxz.cloudfront.net`.

### Test Public Distribution
You want to test to verify that the distribution is setup correctly and has access to the Amazon S3 contents.

Use your browser and enter the URL https://dxxxxxxxxxz.cloudfront.net/sample.html. Remember to replace the domain name with your FQDN. Your sample webpage should come up correctly. However, anyone with your URL can access your Amazon S3 contents.

### Secure Distribution
Next you want to secure the Amazon CloudFront distribution to restrict public access.
1. Choose the **Distribution ID** to open the detail view.
2. Choose the **Behaviors** tab.
3. Select the default **Origin or Origin Group** and choose **Edit**.
4. Under **Restrict Viewer Access (Use Signed URLs or Signed Cookies)** choose **Yes** to expand the **Trusted Key Groups or Trusted Signer** option.
5. Under **Trusted Key Groups or Trusted Signer**, select **Trusted Signer**. (Note: you will change this to **Trusted Key Groups** in later section.)
6. Under **Trusted Signers** select **Self**.
7. Choose **Yes, Edit** to save the changes.

### Test Secured Distribution
Now you want to test to verify that the distribution is restricted. Refresh the webpage and you should see the error message:
> Missing Key-Pair-Id query parameter or cookie value

In this step you created an Amazon CloudFront distribution to distribute your Amazon S3 private contents. You then secured the distribution by using the **Restrict Viewer Access** option.  

In [Step 3](../3-Create_CloudFront_Key_Groups/README.md), you will create the **CloudFront Key Groups**
