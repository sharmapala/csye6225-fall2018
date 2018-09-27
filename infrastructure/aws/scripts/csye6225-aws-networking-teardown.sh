#!/bin/bash
#***********************************************************************************
#    AWS VPC Deletion Shell Script
#***********************************************************************************
#
# SYNOPSIS
#    Automates the DELETION of a custom IPv4 VPC, having public subnet, private subnet,
#    Internet gateway attached to VPC and Route tables
#
# DESCRIPTION
#    This shell script leverages the AWS Command Line Interface (AWS CLI) to
#    automatically delete a custom VPC.

region="us-east-1"

if [ $# -eq 0 ]; then
	echo " PLEASE PASS <STACK_NAME> as parameter while running this script "
	exit 1
fi


# Retrieving VPC Name
echo -e "\n"
echo "***RETRIEVE VPC NAME***"
vpc="$1-csye6225-vpc-1"
vpcname=$(aws ec2 describe-vpcs \
	--query "Vpcs[?Tags[?Key=='Name']|[?Value=='$vpc']].Tags[0].Value" \
	--output text)
echo $vpcname

# Retrieving VPC ID
echo -e "\n"
echo "***RETRIEVE VPC ID***"
vpc_id=$(aws ec2 describe-vpcs \
	--query 'Vpcs[*].{VpcId:VpcId}' \
	--filters Name=is-default,Values=false \
	--output text \
 	--region $region)
echo $vpc_id

# Retrieving Internet-Gateway-Id
echo -e "\n"
echo "***RETRIEVE IGW ID***"
IGW_Id=$(aws ec2 describe-internet-gateways \
 	--query 'InternetGateways[*].{InternetGatewayId:InternetGatewayId}' \
 	--filters "Name=attachment.vpc-id,Values=$vpc_id" \
 	--output text)
echo $IGW_Id

# Retrieving Route-Table-Id
echo -e "\n"
echo "***RETRIEVE ROUTE-TABLE ID***"
route_tbl_id=$(aws ec2 describe-route-tables \
	--filters "Name=vpc-id,Values=$vpc_id" "Name=association.main, Values=false" \
	--query 'RouteTables[*].{RouteTableId:RouteTableId}' \
	--output text)

route_tbl_ids=( $route_tbl_id )
route_tbl_id1=${route_tbl_ids[0]}
route_tbl_id2=${route_tbl_ids[1]}

echo "First Route-Table ID: '$route_tbl_id1'"
echo "Second Route-Table ID: '$route_tbl_id2'"

# Disassociation of Public Subnets with Route Table 1
echo -e "\n"
echo "***SUBNET & PUBLIC ROUTE TABLE DISASSOCIATION***"
aws ec2 describe-route-tables \
	--query 'RouteTables[*].Associations[].{RouteTableAssociationId:RouteTableAssociationId}' \
	--route-table-id $route_tbl_id1 \
	--output text|while read var_associate; do aws ec2 disassociate-route-table --association-id $var_associate; done
echo "SUBNET & PUBLIC ROUTE TABLE DISASSOCIATION completed!"

# Disassociation of Private Subnets with Route Table 2
echo -e "\n"
echo "***SUBNET & PRIVATE ROUTE TABLE DISASSOCIATION***"
aws ec2 describe-route-tables \
	--query 'RouteTables[*].Associations[].{RouteTableAssociationId:RouteTableAssociationId}' \
	--route-table-id $route_tbl_id2 \
	--output text|while read var_associate2; do aws ec2 disassociate-route-table --association-id $var_associate2; done
echo "SUBNET & PRIVATE ROUTE TABLE DISASSOCIATION completed!"

echo -e "\n"
echo "***SUBNETS DELETION***"
while
sub=$(aws ec2 describe-subnets \
	--filters Name=vpc-id,Values=$vpc_id \
	--query 'Subnets[*].SubnetId' \
	--output text)
[[ ! -z $sub ]]
do
        var1=$(echo $sub | cut -f1 -d" ")
        echo $var1 is deleted 
        aws ec2 delete-subnet --subnet-id $var1
done
echo "SUBNETS DELETION completed!"

# Detach Internet Gateway
echo -e "\n"
echo "***DETACH IGW***"
aws ec2 detach-internet-gateway \
	--internet-gateway-id $IGW_Id \
	--vpc-id $vpc_id
echo "DETACH IGW completed!"

# Delete Internet Gateway
echo -e "\n"
echo "***DELETE IGW***"
aws ec2 delete-internet-gateway \
	--internet-gateway-id $IGW_Id
echo "DELETE IGW completed!"

# Retrieving main route table
echo -e "\n"
echo "***RETRIEVE ROUTE TABLE***"
main_route_tbl_id=$(aws ec2 describe-route-tables \
	--query "RouteTables[?VpcId=='$vpc_id']|[?Associations[?Main!=true]].RouteTableId" \
	--output text)

echo "id = $main_route_tbl_id"

#Delete Route-Table
echo -e "\n"
echo "***DELETE ROUTE-TABLE***"
for i in $route_tbl_id
do
	echo "Start------ $main_route_tbl_id"
	if [[ $i != $main_route_tbl_id ]]; then
		aws ec2 delete-route-table --route-table-id $i
		echo $i
	fi
	echo "stop----- $main_route_tbl_id"
done
echo "Route table deleted!"

#Delete vpc
echo -e "\n"
echo "***DELETE VPC***"
aws ec2 delete-vpc --vpc-id $vpc_id
echo "VPC deleted!"
