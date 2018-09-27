#!/usr/bin/env bash
#[ $# -eq 0 ] && { echo -e "\nUsage `basename $0` <Stack Name>\n"; exit 1; }

aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE||CREATE_IN_PROGRESS||REVIEW_IN_PROGRESS||DELETE_IN_PROGRESS||DELETE_FAILED||UPDATE_IN_PROGRESS||DELETE_COMPLETE

echo "Enter the stack you want to delete"
read Stack_Name

#Inputs
#=${1?param missing - Stack Name}
# Stack_Name=${1?Error: Enter correct Stackname}

# Delete the Stack

aws cloudformation delete-stack --stack-name $Stack_Name
