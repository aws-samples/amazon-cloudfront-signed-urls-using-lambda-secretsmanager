## Step 3: Create CloudFront Key Group

In this step you will create a trusted [CloudFront key group](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html#choosing-key-groups-or-AWS-accounts). First you will create a public-private key pair. The key pair must meet the following requirements:
- It must be an SSH-2 RSA key pair.
- It must be in base64-encoded PEM format.
- It must be a 2048-bit key pair.


### Create Key Pair
There are different ways to create an RSA key pair. The following steps use OpenSSL to create a key pair.
1. The following example command uses OpenSSL to generate an RSA key pair with a length of 2048 bits and save to the file named `private_key.pem`.
```
$ openssl genrsa -out private_key.pem 2048
```
2. The resulting file contains both the public and the private key. The following example command extracts the public key from the file named `private_key.pem` and save to the file named `public_key.pem`.
```
$ openssl rsa -pubout -in private_key.pem -out public_key.pem
```

### Upload Public Key
1. On [Amazon CloudFront Management Console](https://console.aws.amazon.com/cloudfront)
2. In the navigation menu, choose **Public keys**.
3. Choose **Add public key**.
4. In the **Add public key** window, complete the following and choose **Add**.
  - For **Key name**, type a name to identify the public key.
  - For **Key value**, copy and paste the contents of the public key. If you followed the steps in the preceding procedure, the public key is in the file named `public_key.pem`.
  - (Optional) For **Comment**, add a comment to describe the public key.  
5. Record the public key ID. You will use it later section.

### Create Key group
1. In the navigation menu, choose **Key groups**.
2. Choose **Add key group**.
3. On the **Create key group** page, do the following:
 - For **Key group name**, type a name to identify the key group.
 - (Optional) For **Comment**, type a comment to describe the key group.
 - For **Public keys**, select the public key to add to the key group, then choose **Add**.
4. Choose **Create key group**.

### Associate Key group
1. In the navigation menu, choose **Distributions**.
2. Choose the **Distribution ID** link you created in Step 2.
3. Choose the **Behaviors** tab.
4. Select the cache behavior and then choose **Edit**.
5. On the **Edit Behavior** page, do the following:
 - For **Trusted Key Groups or Trusted Signer**, choose **Trusted Key Groups**.
 - For **Trusted Key Groups**, choose the key group to add, and then choose **Add**.
6. Choose **Yes, Edit** to update the cache behavior.

In this step you generated a public-private key pair, created a CloudFront Key group with a public key, and associated the Key group to your CloudFront distribution.

In [Step 4](../4-Create_Secrets_Manager/README.md) we will create a secret in **AWS Secrets Managers**.
