# Templates for BCDevOps/backup-container

> See the following links for background on how the `BCDevOps/backup-container` works
>
> -   https://github.com/BCDevOps/backup-container
> -   https://github.com/bcgov/digital_marketplace/tree/development/openshift/templates/backup

## Overview

The OpenShift Templates in this project work for both Postgres and Mongo databases.

## Usage

1.  Copy the files from this directory to your local filesystem
2.  Open a terminal and apply `build.yaml` to OpenShift

    Postgres:

        oc process -f ./build.yaml \
            -p NAME=backup-<app_name> \
            | oc -n <project_id>-tools apply -f -

    MongoDB:

        oc process -f ./build.yaml \
            -p NAME=backup-<app_name> \
            -p DOCKER_FILE_PATH=Dockerfile_Mongo \
            | oc -n <project_id>-tools apply -f -

3.  Tag the resulting build.

    > This command may fail if the build has not been created yet. Try again once the build is available

        oc -n <project_id>-tools tag backup-<app_name>:latest backup-<app_name>:<dev|test|prod>

4.  Modify `config.yaml`. In the empty space of `ConfigMap->data->backup.conf`, add a configuration for each database you want to back up. Do not mix and match configurations for postgres and mongo.

    The format for each line should be as follows:

        <postgres|mongo>=<DATABASE_SERVICE_NAME>:<DATABASE_PORT>/<DATABASE_NAME>

5.  Apply `config.yaml` to OpenShift

        oc process -f ./config.yaml \
            -p NAME=backup-<app_name> \
            | oc -n <project_id>-<dev|test|prod> apply -f -

6.  Apply `deploy.yaml` to OpenShift

    Postgres

        oc process -f ./deploy.yaml \
            -p NAME=backup-<app_name> \
            -p IMAGE_NAMESPACE=<project_id>-tools \
            -p TAG_NAME=<dev|test|prod> \
            -p DATABASE_CREDENTIALS_SECRET=<secret_collection> \
            -p DATABASE_CREDENTIALS_USER_KEY=<secret_username_key> \
            -p DATABASE_CREDENTIALS_PASSWORD_KEY=<secret_password_key> \
            | oc -n <project_id>-<dev|test|prod> apply -f -

    MongoDB

        oc process -f ./deploy.yaml \
            -p NAME=backup-<app_name> \
            -p IMAGE_NAMESPACE=<project_id>-tools \
            -p TAG_NAME=<dev|test|prod> \
            -p MONGODB_AUTHENTICATION_DATABASE=<authentication_database> \
            -p DATABASE_CREDENTIALS_SECRET=<secret_collection> \
            -p DATABASE_CREDENTIALS_USER_KEY=<secret_username_key> \
            -p DATABASE_CREDENTIALS_PASSWORD_KEY=<secret_password_key> \
            -p VERIFICATION_VOLUME_MOUNT_PATH=/var/lib/mongodb/data \
            | oc -n <project_id>-<dev|test|prod> apply -f -
