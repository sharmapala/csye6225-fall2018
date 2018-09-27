#!/usr/bin/env bash
[ $# -eq 0 ] && { echo -e "\nUsage `basename $0` <Stack Name>\n"; exit 1; }

#Inputs
stackName=${1?param missing - Stack Name}
# Stack_Name=${1?Error: Enter correct Stackname}


# Delete the Stack

aws cloudformation delete-stack --stack-name ${stackName}
