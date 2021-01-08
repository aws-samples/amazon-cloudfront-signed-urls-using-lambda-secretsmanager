## Step 3: Create CloudFront Key Pair

In this step we will use AWS IAM to create a CloudFront key pair. Each AWS account can have a maximum of two CloudFront key pairs. In addition, the **CloudFront Key Pair** feature is only available to the AWS root account user.

**Note**: In this step you will need to login to your AWS account as the root user with your email address and password. If you are using a different AWS account in this step, remember to add this account number to the Trusted Signer section of the CloudFront distribution behavior in the CloudFront distribution account that you created in Step 2.

### Create Key Pair
1. Log into your AWS account as a root user and navigate to the [Amazon My Security Credentials Console](https://console.aws.amazon.com/iam/home?region=us-east-1#/security_credentials)
2. Select **CloudFront key pairs**
3. Select **Create New Pair**
4. Download the private key and save it in secured place. The private key is the one with file name staring with `'pk-xxxxxxxxxx.pem'`. You can download the public key in the future if needed
5. Copy the **Access Key ID** which you will need later
6. Logout of the AWS account for security best practice as we don't want to use the root account for other activities.

In this step we logged into AWS as the root user and created an Amazon CloudFront key pair.  

In [Step 4](../4-Create_Secrets_Manager/README.md) we will create a secret in **AWS Secrets Managers**.
