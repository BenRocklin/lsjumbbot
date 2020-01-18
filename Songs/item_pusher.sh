#!/bin/sh
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
echo $SCRIPTPATH
if [ -z "$groupMeApiKey" ]; then
	echo "Please set up your .env and source it as described in the readme."
	exit 69
fi

#echo "Begin Output:" > urls.txt
for entry in "Images"/*
	do
	response="$(curl 'https://image.groupme.com/pictures' -X POST -H "X-Access-Token: $groupMeApiKey" -H "Content-Type: image/jpeg" --data-binary @"$entry")"
	# need jq
	url=$(echo "$response" | jq '.payload | .picture_url')
	echo "$response"
	echo "${entry} ${url}" >> urls.txt
done