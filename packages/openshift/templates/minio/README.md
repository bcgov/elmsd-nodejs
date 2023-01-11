# MinIO OpenShift Template

## <a name="installation"></a>Installation

These manifests deploy MinIO to OpenShift.  Choose one of the commands below based on your needs.

**Note:** If you want to use Single Sign On (SSO) to administer the MinIO Installation, see the [Single Sign On (SSO)](#sso) section for additional configuration parameters *before* deploying your selected manifest.  If you want to add SSO later, use the MinIO GUI.

### Single Node Instance (Ephemeral)

```sh
oc process -f ./minio.yaml \
    -p NAMESPACE=<namespace> \
    -p MINIO_CONSOLE_SUBDOMAIN=minio-console-<namespace> \
    -p MINIO_SERVER_SUBDOMAIN=minio-<namespace> \
    -p MINIO_ROOT_USER=<username> \
    -p MINIO_ROOT_PASSWORD=<password> \
    -p PVC_STORAGE_SIZE=1Gi \
    | oc apply -f -
```
### 4 Node Cluster (Persistent)**

```sh
oc process -f ./minio-cluster.yaml \
    -p NAMESPACE=<namespace> \
    -p MINIO_CONSOLE_SUBDOMAIN=minio-console-<namespace> \
    -p MINIO_SERVER_SUBDOMAIN=minio-<namespace> \
    -p MINIO_ROOT_USER=<username> \
    -p MINIO_ROOT_PASSWORD=<password> \
    -p PVC_STORAGE_SIZE=1Gi \
    | oc apply -f -
```

## <a name="usage"></a>Usage

**Note:** Install the [MinIO Client](https://min.io/docs/minio/linux/reference/minio-mc.html) (mc) before continuing in this section.

### Create an alias to administer your MinIO Instance
---
```sh
mc alias set <alias> <server-url> <username> <password>
```
**Note:** If your alias starts with a number, you can't use mc.  Edit the mc config file directly, located at *~/.mc/config.json` on MacOS/Linux.

**~/.mc/config.json**
```json
{
    "version": "10",
    "aliases": {
        ...
        "<alias>": {
            "url": "<server-url>",
            "accessKey": "<username>",
            "secretKey": "<password>",
            "api": "S3v4",
            "path": "auto"
        },
        ...
    }
}
```
    
### Create a public bucket
---

Public files can be stored in this bucket

```sh
# Create public bucket
mc mb <alias>/public

# Provide download access to anonymous users
mc anonymous set download <alias>/public
```

### Deploy resources for WorkBC Providers
---
This is a very basic example of deploying buckets, users and policies to support WorkBC Service Providers.  Replace `n` with how many WorkBC Service Providers you'd like to deploy.

```sh
for i in {1..n}
do
    # Create a public bucket, for files related to the WorkBC Service Provider
    mc mb <alias>/public-service-provider-$i
    mc anonymous set download <alias>/public-service-provider-$i

    # Create a private bucket for the WorkBC Service Provider
    mc mb <alias>/service-provider-$i

    # Create a read/write policy for the private bucket
    echo "{\"Version\": \"2012-10-17\",\"Statement\": [{\"Action\": [\"s3:ListBucket\",\"s3:PutObject\",\"s3:GetObject\",\"s3:DeleteObject\"],\"Effect\": \"Allow\",\"Resource\": [\"arn:aws:s3:::service-provider-$i\/*\", \"arn:aws:s3:::service-provider-$i\"],\"Sid\": \"BucketAccessForUser\"}]}" | mc admin policy add <alias> readwrite-service-provider-$i /dev/stdin

    # Create a user account to access the private bucket
    mc admin user add <alias> service-provider-$i service-provider-$i

    # Apply the read/write policy for the private bucket to the user account
    mc admin policy set <alias> readwrite-service-provider-$i user=service-provider-$i
done
```


## <a name="sso"></a>Single Sign On (SSO)

Create a SSO Client at the [Common Hosted Single Sign-On](https://bcgov.github.io/sso-requests) site.  Pay special attention to *Step 2* and *Step 3*.

&nbsp;&nbsp;&nbsp;&nbsp;**Step 2:** Basic Info

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Select Client Protocol:** *OpenID Connect*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Select Usecase:** *Browser Login*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Additional Role Attribute (optional):** *policy*

&nbsp;&nbsp;&nbsp;&nbsp;**Step 3:** Development/Test/Production

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Redirect URIs:** *\**

Once your client is available, create the following 5 roles which map to MinIO policies:

1. consoleAdmin
2. diagnostics
3. readonly
4. readwrite
5. writeonly

Assign your user to the `consoleAdmin` role so it can access the MinIO GUI.

To configure the deployment, fill out the following parameters and use them when deploying your selected manifest in the [Installation](#installation) section.

```sh
    -p MINIO_IDENTITY_OPENID_CONFIG_URL=<sso-config-url> \
    -p MINIO_IDENTITY_OPENID_CLIENT_ID=<sso-client-id> \
    -p MINIO_IDENTITY_OPENID_CLIENT_SECRET=<sso-client-secret> \
    -p MINIO_IDENTITY_OPENID_SCOPES=openid,idir,profile \
```