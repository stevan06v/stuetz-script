#!/bin/bash

echo "| Key | Value |"
echo "| --- | --- |"
cat keywords.json | jq -r 'to_entries | map("| \(.key) | \(.value|tostring) |") | .[]'
