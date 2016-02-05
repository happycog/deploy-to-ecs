#!/bin/bash

# REPO="davidsbridal-dev"
# BRANCH="ticket-13272"
REPO=$1
BRANCH=$2
STACKNAME="${REPO}-${BRANCH}"
IMAGENAME="tutum.co/happycog/${REPO}-${BRANCH}-web"

STACKJSON=$(curl -s -X GET -H "Authorization: ApiKey happycog:eb031873a51f69d1da882f9e561968a2009447ed" -H "Content-type: application/json" -H "User-agent: curl" https://dashboard.tutum.co/api/v1/stack/?name=${STACKNAME})
STACKUUID=$(echo ${STACKJSON} | jq --raw-output .objects[0].uuid)
echo ">>> DELETE ${STACKNAME} (${STACKUUID})"
curl -s -X DELETE -H "Authorization: ApiKey happycog:eb031873a51f69d1da882f9e561968a2009447ed" -H "Content-type: application/json" -H "User-agent: curl" https://dashboard.tutum.co/api/v1/stack/${STACKUUID}/

echo ">>> WAITING for stack delete"
sleep 5

echo ">>> DELETE ${IMAGENAME}"
curl -s -X DELETE -H "Authorization: ApiKey happycog:eb031873a51f69d1da882f9e561968a2009447ed" -H "Content-type: application/json" -H "User-agent: curl" https://dashboard.tutum.co/api/v1/image/${IMAGENAME}/?name=${IMAGENAME}

echo ">>> DELETE upstream.com.cogclient.${REPO}.${BRANCH}:80"
curl -X DELETE -H "Content-type: application/json" -H "User-agent: curl" -d "[\"upstream.com.cogclient.${REPO}.${BRANCH}:80\"]" http://web.cogclient-proxy.happycog.svc.tutum.io:26542/
