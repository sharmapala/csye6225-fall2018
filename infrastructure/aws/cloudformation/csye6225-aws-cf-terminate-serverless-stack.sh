#!/usr/bin/env bash
#[ $# -eq 0 ] && { echo -e "\nUsage `basename $0` <Stack Name>\n"; exit 1; }

aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE||CREATE_IN_PROGRESS||REVIEW_IN_PROGRESS||DELETE_IN_PROGRESS||DELETE_FAILED||UPDATE_IN_PROGRESS||DELETE_COMPLETE

echo "Enter the stack you want to delete"
read Stack_Name

echo -e "\n"
echo "Enter S3 Bucket Name ie your domain Name, csye6225-fall2018-huskyid.me"
read S3_Bucket
#Inputs
#=${1?param missing - Stack Name}
# Stack_Name=${1?Error: Enter correct Stackname}


#empty code-deploy.csye6225-fall2018-phadated.me bucket first
aws s3 rm s3://$S3_Bucket --recursive

# Delete the Stack

aws cloudformation delete-stack --stack-name $Stack_Name

Success=$(aws cloudformation wait stack-delete-complete --stack-name $Stack_Name)
if [[ -z "$Success" ]]
then
  echo "$Stack_Name stack is deleted successfully"
else
  echo "Deletion of $Stack_Name stack failed."
  echo "$Success"
  exit 1
fi

