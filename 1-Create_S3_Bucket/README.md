## Step 1: Create Amazon S3 Bucket

In this step you will stage a private Amazon S3 bucket with a sample HTML file.

**Note**: Amazon S3 routes any virtual hosted–style requests to the US East (N. Virginia) region by default if you use the US East (N. Virginia) endpoint (s3.amazonaws.com), When you create a new bucket, in any region, Amazon S3 updates DNS to reroute the request to the correct region, which might take time when using Amazon CloudFront for distribution in later section. For the purpose of this exercise, you will create a new bucket in AWS **region** `us-east-1`. Detailed explanation of **AWS Virtual hosting of buckets** is provided in [AWS User Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html).

### Create S3 Bucket
1. Log into your AWS account and navigate to the [Amazon S3 Management Console](https://s3.console.aws.amazon.com/).
2. Choose **Create Bucket**.
3. Provide a name for **Bucket name**.
4. Select **US East (N. Virginia) us-east-1** for **AWS Region** .
5. Leave everything as default.
6. Choose **Create bucket** to create the bucket.
7. Choose the bucket you just created.
8. Choose **Upload**.
9. Choose **Add files**.
10. Choose the included sample file `sample.html` from your local drive.
11. Choose **Upload** to upload the file.

You successfully created an Amazon S3 bucket and uploaded a sample HTML file. However if you try to access the sample HTML file using the S3 object URL, like `https://yourbucket.s3-us-west-2.amazonaws.com/sample.html`, in your browser you will get an access denied message. This is exactly what you want. You want to keep your S3 contents private and will only distribute them using an Amazon CloudFront distribution.

In [Step 2](../2-Create_CloudFront_Distribution/README.md), you will create the Amazon CloudFront Distribution.
