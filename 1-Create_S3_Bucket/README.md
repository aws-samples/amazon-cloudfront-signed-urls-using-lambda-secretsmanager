## Step 1: Create Amazon S3 Bucket

In this step we will stage a private Amazon S3 bucket with a sample HTML file.

**Note**: Use an IAM user account in this step for security best practices.

### Create S3 Bucket
1. Log into your AWS account and navigate to the [Amazon S3 Management Console](https://s3.console.aws.amazon.com/).
2. Select **Create Bucket**.
3. Provide **Bucket name** and select any **Region**.
4. Leave everything as default.
5. Select **Create bucket** to create the Bucket.
6. Select the bucket you just created.
7. Select **Upload**.
8. Select **Add files**.
9. Select the sample file `sample.html` from your computer.
10. Select **Upload** to upload the file.

We successfully created an Amazon S3 bucket and uploaded a sample HTML file. However if you try to access the sample HTML file using the S3 object URL, like `https://yourbucket.s3-us-west-2.amazonaws.com/sample.html`, in your browser you will get an access denied message. This is exactly what we want. We want to keep our S3 contents private and will only distribute them using an Amazon CloudFront distribution.

In [Step 2](../2-Create_CloudFront_Distribution/README.md), we will create the Amazon CloudFront Distribution.
