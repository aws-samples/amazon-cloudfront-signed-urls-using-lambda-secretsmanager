## Step 2: Create Amazon CloudFront Distribution

In this step you will create an Amazon CloudFront distribution with your Amazon S3 bucket created in Step 1 as source. You will also restrict access to the bucket by using [Origin Access Control (OAC)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html), which is the recommended replacement for the legacy Origin Access Identity (OAI).

### Create Distribution
1. Log into your AWS account and navigate to the [Amazon CloudFront Management Console](https://console.aws.amazon.com/cloudfront).
2. Choose **Create Distribution**.
3. For **Choose a plan** choose **Free** and choose **Next**.
4. For **Distribution name**, provide a name and choose **Next**.
5. For **Origin type** choose **Amazon S3**.
6. For **Origin** choose your Amazon S3 Bucket from Step 1 and choose **Next**.
7. For **Enable security** choose **Next** and choose **Create Distribution**.

> **Note:** CloudFront automatically creates an Origin Access Control (OAC) policy and updates your S3 bucket permissions to allow access only from this distribution. No manual bucket policy update is required.

8. In the distribution details screen, note the **Last modified** status. Wait for it to show a timestamp, indicating the distribution is **Deployed**. This can take up to 5 minutes.
9. Under **Details**, copy the **Distribution domain name**, similar to `dxxxxxxxxxz.cloudfront.net`.

### Test Public Distribution
Verify that the distribution is set up correctly and can access your Amazon S3 contents.

Use your browser and enter the URL `https://dxxxxxxxxxz.cloudfront.net/sample.html`. Remember to replace the domain name with your own. Your sample webpage should render correctly. However, anyone with your URL can access your Amazon S3 contents.

### Secure Distribution
Next you want to restrict the Amazon CloudFront distribution so only signed URLs are accepted.
1. Choose the **Distribution ID** to open the detail view.
2. Choose the **Behaviors** tab.
3. Select the default behavior and choose **Edit**.
4. Under **Restrict viewer access** choose **Yes**.
5. Under **Trusted authorization type**, select **Trusted signer** for now.
6. You will add the key group in Step 3. For now choose **Save changes**.

### Test Secured Distribution
Refresh the webpage and you should see the error message:
> Missing Key-Pair-Id query parameter or cookie value

In this step you created an Amazon CloudFront distribution to distribute your Amazon S3 private contents. You then secured the distribution using **Restrict viewer access**.

In [Step 3](../3-Create_CloudFront_Key_Groups/README.md), you will create the **CloudFront Key Groups**.
