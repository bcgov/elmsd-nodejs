# EFK Stack OpenShift Template

OpenShift template to deploy an EFK (ElasticSearch, Fluent Bit, Kibana) Stack accessible by other namespaces.

## Installation

1.  Deploy ElasticSearch

        # Deploy elasticsearch.yaml
        oc process -f ./elasticsearch.yaml \
            -p NAMESPACE=<namespace> \
            -p ELASTICSEARCH_STORAGE_REQUEST=<Gi|Mi|Ki> \
            | oc apply -f -

2.  Configure & Deploy Fluent Bit

    Create an `[OUPUT]` block for each source of logs you want to send to ElasticSearch. Logs are sent to Fluent Bit via a HTTP endpoint, http://\<fluent-bit-url>:\<fluent-bit-port>/\<tag-name>, for example.

    _Note: If the value of \<tag-name> contains any special characters, they will be removed/replaced when referenced in the `Match` line. For example, if the \<tag-name> is `workbc-mobile-api`, the \<camel-case-tag> will be `workbc_mobile_api`._

    **Configure fluent-bit.cm.yaml**

        ...
        fluent-bit.conf: |-
            [SERVICE]
            Flush         5
            Daemon        Off
            Parsers_File  parsers.conf
            Log_Level     debug
            HTTP_Server   On
            HTTP_Listen   0.0.0.0
            HTTP_PORT     2020

            [INPUT]
            Name  http
            Host  0.0.0.0
            Port  8888

            # [OUTPUT]
            #   Name                es
            #   Match               <camel-case-tag>
            #   Host                "${ELASTICSEARCH_HOST}"
            #   Port                "${ELASTICSEARCH_PORT}"
            #   Index               <tag-name>
            #   Type                _doc
            #   Suppress_Type_Name  On
        ...

    **Deploy**

        # Deploy fluent-bit.cm.yaml
        oc process -f ./fluent-bit.cm.yaml \
            -p NAMESPACE=<namespace> \
            -p ELASTICSEARCH_HOST=<elasticsearch-service-hostname> \
            -p ELASTICSEARCH_PORT=<elasticsearch-service-port> \
            | oc apply -f -

        # Deploy fluent-bit.yaml
        oc process -f ./fluent-bit.yaml \
            -p NAMESPACE=<namespace> \
            | oc apply -f -

3.  **Deploy Kibana**

        # Deploy kibana.yml
        oc process -f ./kibana.yaml \
            -p NAMESPACE=<namespace> \
            -p ELASTICSEARCH_HOST=<elasticsearch-service-hostname> \
            -p ELASTICSEARCH_PORT=<elasticsearch-service-port> \
            | oc apply -f -

4.  **Create Network Policies**

    In the same \${NAMESPACE} as above, create a `NetworkPolicy` for each \${SOURCE_NAMESPACE} which will send logs to the Fluent Bit deployment

        kind: NetworkPolicy
        apiVersion: networking.k8s.io/v1
        metadata:
            name: "allow-connections-from-${SOURCE_NAMESPACE}-to-fluent-bit"
            namespace: "${NAMESPACE}"
        spec:
            podSelector:
                matchLabels:
                    app: fluent-bit
            ingress:
                - from:
                    - namespaceSelector:
                            matchLabels:
                                kubernetes.io/metadata.name: "${SOURCE_NAMESPACE}"
            policyTypes:
                - Ingress
