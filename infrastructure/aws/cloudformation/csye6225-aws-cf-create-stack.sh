# Create AWS CFN Stack - wrapper for `aws cloudformation create-stack`
#Example Usage:
[ $# -eq 0 ] && { echo -e "\nUsage `basename $0` <stack name> <CFN template file> <JSON parameters file>\n\nExample:\n`basename $0` mystackname MyCfn.template stackParams.json stackTags.json\n"; exit 1; }

#Inputs

stackName=${1?param missing - Stack Name}
templateFile=${2?param missing - Template File}
paramsFile=${3?param missing - Json Parameters file}
#tagsFile=${4?param missing - Json Tags file}

if [ $# -gt 3 ]; then
	echo 1>&2 "$0: too many arguments"
	exit 1

fi

#Functions
#-------------------------------------------------------------------------------
# Retrieve the status of a cfn stack
# Args:
# $1  The name of the stack
#-------------------------------------------------------------------------------

getStackStatus() {
	aws cloudformation describe-stacks \
		--stack-name $1 \
		--query Stacks[].StackStatus \
		--output text
}

#-------------------------------------------------------------------------------
# Waits for a stack to reach a given status. If the stack ever reports any
# status other thatn *_IN_PROGRESS we will return failure status, as all other
# statuses that are not the one we are waiting for are considered terminal
# Args:
# $1  Stack name
# $2  The stack status to wait for
#-------------------------------------------------------------------------------

waitForState() {
	local status

	status=$(getStackStatus $1)

	while [[ "$status" != "$2" ]]; do

		echo "Waiting for stack $1 to obtain status $2 - Current status: $status"
		# If the status is not one of the "_IN_PROGRESS" status' then consider

		# this an error
		if [[ "$status" != *"_IN_PROGRESS"* ]]; then
			exitWithErrorMessage "Unexpected status '$status'"
		fi

		status=$(getStackStatus $1)
		sleep 5

	done

	echo "Stack $1 obtained $2 status"

}


exitWithErrorMessage() {
	echo "ERROR: $1"
	exit 1
}
#-------------------------------------------------------------------------------
# Returns a file URL for the given path
#
# Args:
# $1  Path
#-------------------------------------------------------------------------------


#Create Stack
aws cloudformation create-stack \
	--stack-name $1 \
	--template-url $2 \
	--parameters $3 \
	--disable-rollback


if ! [ "$?" = "0" ]; then

	exitWithErrorMessage "Cannot create stack ${stackName}!"

fi

#Wait for completion
waitForState ${stackName} "CREATE_COMPLETE"
