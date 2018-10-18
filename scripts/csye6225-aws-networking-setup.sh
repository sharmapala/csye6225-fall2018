#!/bin/bash
#***********************************************************************************
#    AWS VPC Creation Shell Script
#***********************************************************************************
#
# SYNOPSIS
#    Automates the CREATION of a custom IPv4 VPC, having public subnet, private subnet,
#    Internet gateway attached to VPC and Route tables
#
# DESCRIPTION
#    This shell script leverages the AWS Command Line Interface (AWS CLI) to
#    automatically create a custom VPC.


if [ $# -eq 0 ]; then
echo "PLEASE PASS <STACK_NAME> as parameter while running your script"
exit 1
fi

region="us-east-1"
vpcName="$1-csye6225-vpc-1"
internetGatewayName="$1-csye6225-InternetGateway-1"
vpc_cidr="10.0.0.0/16"
publicRouteTableName="$1-csye6225-public-route-table"
privateRouteTableName="$1-csye6225-private-route-table"
ZONE1="us-east-1a"
ZONE2="us-east-1b"
ZONE3="us-east-1c"
PublicSubnet1="$1-csye-public-subnet-1"
PublicSubnet2="$1-csye-public-subnet-2"
PublicSubnet3="$1-csye-public-subnet-3"
PrivateSubnet1="$1-csye-private-subnet-1"
PrivateSubnet2="$1-csye-private-subnet-2"
PrivateSubnet3="$1-csye-private-subnet-3"

# Create VPC
echo -e "\n"
echo "CREATE VPC"
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block $vpc_cidr \
  --query 'Vpc.{VpcId:VpcId}' \
  --output text \
  --region $region 2>&1)
VPC_CREATE_STATUS=$?
if [ $VPC_CREATE_STATUS -eq 0 ]; then
  echo " VPC ID '$VPC_ID' CREATED in '$region' region."
else
	echo "Error:VPC not created!!"
  echo " $VPC_ID "
	exit $VPC_CREATE_STATUS
fi

# Rename VPC
echo -e "\n"
echo "RENAME VPC"
VPC_RENAME=$(aws ec2 create-tags \
  --resources $VPC_ID \
  --tags "Key=Name,Value=$vpcName" \
  --region $region 2>&1)
VPC_RENAME_STATUS=$?
if [ $VPC_RENAME_STATUS -eq 0 ]; then
  echo "  VPC ID '$VPC_ID' NAMED as '$vpcName'."
else
    echo "Error:VPC name not added!!"
    echo " $VPC_RENAME "
    exit $VPC_RENAME_STATUS
fi

# Create Internet gateway
echo -e "\n"
echo "CREATE INTERNET GATEWAY"
IGW_ID=$(aws ec2 create-internet-gateway \
  --query 'InternetGateway.{InternetGatewayId:InternetGatewayId}' \
  --output text \
  --region $region 2>&1)
IGW_CREATE_STATUS=$?
if [ $IGW_CREATE_STATUS -eq 0 ]; then
  echo "  Internet Gateway ID '$IGW_ID' CREATED."
else
    echo "Error:Gateway not created"
    echo " $IGW_ID "
    exit $IGW_CREATE_STATUS
fi

# Rename Internet gateway
echo -e "\n"
echo "RENAME INTERNET GATEWAY"
IGW_RENAME=$(aws ec2 create-tags \
  --resources $IGW_ID \
  --tags "Key=Name,Value=$internetGatewayName" 2>&1)
IGW_RENAME_STATUS=$?
if [ $IGW_RENAME_STATUS -eq 0 ]; then
  echo "  Internet gateway ID '$IGW_ID' NAMED as '$internetGatewayName'."
else
    echo "Error:internetGatewayName name not added!!"
    echo " $IGW_RENAME "
    exit $IGW_RENAME_STATUS
fi

# Attach Internet gateway to your VPC
echo -e "\n"
echo "ATTACH IGW to VPC"
IGW_ATTACH=$(aws ec2 attach-internet-gateway \
  --vpc-id $VPC_ID \
  --internet-gateway-id $IGW_ID \
  --region $region 2>&1)
IGW_ATTACH_STATUS=$?
if [ $IGW_ATTACH_STATUS -eq 0 ]; then
  echo "  Internet Gateway ID '$IGW_ID' ATTACHED to VPC ID '$VPC_ID'."
else
    echo "Error:Gateway not attached to VPC: $?"
    echo " $IGW_ATTACH "
    exit $IGW_ATTACH_STATUS
fi

echo -e "\n"
echo "Please provide IP Address for subnet 1 in x.x.x.x/x"
read PUBLIC_SUBNET1

#echo "Please provide Availability zones for Public subnet 1"
PUBLIC_SUBNET_1=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block $PUBLIC_SUBNET1 \
  --availability-zone $ZONE1 \
  --query 'Subnet.{SubnetId:SubnetId}' \
  --output text \
  --region $region)

echo  "Subnet ID '$PUBLIC_SUBNET_1' is created in '$ZONE1'" "Availability Zone."

# Rename Public Subnet 1
echo -e "\n"
echo "RENAME PUBLIC SUBNET 1"
SUBNET_RENAME=$(aws ec2 create-tags \
  --resources $PUBLIC_SUBNET_1 \
  --tags "Key=Name,Value=$PublicSubnet1" 2>&1)
SUBNET_RENAME_STATUS=$?
if [ $SUBNET_RENAME_STATUS -eq 0 ]; then
  echo "Public Subnet ID '$PUBLIC_SUBNET_1' NAMED as '$PublicSubnet1'."
else
    echo "Error:PublicSubnet1 name not added!!"
    echo " $SUBNET_RENAME "
    exit $SUBNET_RENAME_STATUS
fi

echo -e "\n"
echo "Please provide IP Address for Public subnet 2 in x.x.x.x/x"
read PUBLIC_SUBNET2

#echo "Please provide Availability zones for Public subnet 2"
PUBLIC_SUBNET_2=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block $PUBLIC_SUBNET2 \
  --availability-zone $ZONE2 \
  --query 'Subnet.{SubnetId:SubnetId}' \
  --output text \
  --region $region)

echo  "Subnet ID '$PUBLIC_SUBNET_2' is created in '$ZONE2'" "Availability Zone."

# Rename Public Subnet 2
echo -e "\n"
echo "RENAME PUBLIC SUBNET 2"
SUBNET_RENAME=$(aws ec2 create-tags \
  --resources $PUBLIC_SUBNET_2 \
  --tags "Key=Name,Value=$PublicSubnet2" 2>&1)
SUBNET_RENAME_STATUS=$?
if [ $SUBNET_RENAME_STATUS -eq 0 ]; then
  echo "Public Subnet ID '$PUBLIC_SUBNET_2' NAMED as '$PublicSubnet2'."
else
    echo "Error:PublicSubnet2 name not added!!"
    echo " $SUBNET_RENAME "
    exit $SUBNET_RENAME_STATUS
fi


echo -e "\n"
echo "Please provide IP Address for Public subnet 3 in x.x.x.x/x"
read PUBLIC_SUBNET3

# echo "Please provide Availability zones for Public subnet 3"
PUBLIC_SUBNET_3=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block $PUBLIC_SUBNET3 \
  --availability-zone $ZONE3 \
  --query 'Subnet.{SubnetId:SubnetId}' \
  --output text \
  --region $region)

echo  "Subnet ID '$PUBLIC_SUBNET_3' is created in '$ZONE3'" "Availability Zone."

# Rename Public Subnet 3
echo -e "\n"
echo "RENAME PUBLIC SUBNET 3"
SUBNET_RENAME=$(aws ec2 create-tags \
  --resources $PUBLIC_SUBNET_3 \
  --tags "Key=Name,Value=$PublicSubnet3" 2>&1)
SUBNET_RENAME_STATUS=$?
if [ $SUBNET_RENAME_STATUS -eq 0 ]; then
  echo "Public Subnet ID '$PUBLIC_SUBNET_3' NAMED as '$PublicSubnet3'."
else
    echo "Error:PublicSubnet3 name not added!!"
    echo " $SUBNET_RENAME "
    exit $SUBNET_RENAME_STATUS
fi

echo -e "\n"
echo "Please provide IP Address for Private subnet 1 in x.x.x.x/x"
read PRIVATE_SUBNET1

#echo "Please provide Availability zones for Private subnet 1"
PRIVATE_SUBNET_1=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block $PRIVATE_SUBNET1 \
  --availability-zone $ZONE1 \
  --query 'Subnet.{SubnetId:SubnetId}' \
  --output text \
  --region $region)

echo  "Subnet ID '$PRIVATE_SUBNET_1' is created in '$ZONE1'" "Availability Zone."

# Rename Private Subnet 1
echo -e "\n"
echo "RENAME PRIVATE SUBNET 1"
SUBNET_RENAME=$(aws ec2 create-tags \
  --resources $PRIVATE_SUBNET_1 \
  --tags "Key=Name,Value=$PrivateSubnet1" 2>&1)
SUBNET_RENAME_STATUS=$?
if [ $SUBNET_RENAME_STATUS -eq 0 ]; then
  echo "Public Subnet ID '$PRIVATE_SUBNET_1' NAMED as '$PrivateSubnet1'."
else
    echo "Error:PrivateSubnet1 name not added!!"
    echo "$SUBNET_RENAME"
    exit $SUBNET_RENAME_STATUS
fi

echo -e "\n"
echo "Please provide IP Address for Private subnet 2 in x.x.x.x/x"
read PRIVATE_SUBNET2

#echo "Please provide Availability zones for Private subnet 2"
PRIVATE_SUBNET_2=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block $PRIVATE_SUBNET2 \
  --availability-zone $ZONE2 \
  --query 'Subnet.{SubnetId:SubnetId}' \
  --output text \
  --region $region)

echo  "Subnet ID '$PRIVATE_SUBNET_2' is created in '$ZONE2'" "Availability Zone."


# Rename Private Subnet 2
echo -e "\n"
echo "RENAME PRIVATE SUBNET 2"
SUBNET_RENAME=$(aws ec2 create-tags \
  --resources $PRIVATE_SUBNET_2 \
  --tags "Key=Name,Value=$PrivateSubnet2" 2>&1)
SUBNET_RENAME_STATUS=$?
if [ $SUBNET_RENAME_STATUS -eq 0 ]; then
  echo "Public Subnet ID '$PRIVATE_SUBNET_2' NAMED as '$PrivateSubnet2'."
else
    echo "Error:PrivateSubnet2 name not added!!"
    echo "$SUBNET_RENAME"
    exit $SUBNET_RENAME_STATUS
fi

echo -e "\n"
echo "Please provide IP Address for Private subnet 3 in x.x.x.x/x"
read PRIVATE_SUBNET3

#echo "Please provide Availability zones for Private subnet 3"
PRIVATE_SUBNET_3=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block $PRIVATE_SUBNET3 \
  --availability-zone $ZONE3 \
  --query 'Subnet.{SubnetId:SubnetId}' \
  --output text \
  --region $region)

echo  "Subnet ID '$PRIVATE_SUBNET_3' is created in '$ZONE3'" "Availability Zone."

# Rename Private Subnet 3
echo -e "\n"
echo "RENAME PRIVATE SUBNET 3"
SUBNET_RENAME=$(aws ec2 create-tags \
  --resources $PRIVATE_SUBNET_3 \
  --tags "Key=Name,Value=$PrivateSubnet3" 2>&1)
SUBNET_RENAME_STATUS=$?
if [ $SUBNET_RENAME_STATUS -eq 0 ]; then
  echo "Public Subnet ID '$PRIVATE_SUBNET_3' NAMED as '$PrivateSubnet3'."
else
    echo "Error:PrivateSubnet3 name not added!!"
    echo "$SUBNET_RENAME"
    exit $SUBNET_RENAME_STATUS
fi

# Create Public Route Table
echo -e "\n"
echo "***CREATE ROUTE TABLE***"
PUBLIC_ROUTE_TABLE_ID=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --query 'RouteTable.{RouteTableId:RouteTableId}' \
  --output text \
  --region $region 2>&1)
  ROUTE_TABLE_CREATE_STATUS=$?
if [ $ROUTE_TABLE_CREATE_STATUS -eq 0 ]; then
  echo "Route Table ID '$PUBLIC_ROUTE_TABLE_ID' CREATED."
else
    echo "Error:Route table not created!!"
    echo "$PUBLIC_ROUTE_TABLE_ID "
    exit $ROUTE_TABLE_CREATE_STATUS
fi

# Rename to Public Route Table
echo -e "\n"
echo "***RENAME ROUTE TABLE***"
ROUTE_TABLE_RENAME=$(aws ec2 create-tags \
  --resources $PUBLIC_ROUTE_TABLE_ID \
  --tags "Key=Name,Value=$publicRouteTableName" 2>&1)
ROUTE_TABLE_RENAME_STATUS=$?
if [ $ROUTE_TABLE_RENAME_STATUS -eq 0 ]; then
  echo "Route table ID '$PUBLIC_ROUTE_TABLE_ID' NAMED as '$publicRouteTableName'."
else
    echo "Error:ROUTE_TABLE name not added!!"
    echo " $ROUTE_TABLE_RENAME "
    exit $ROUTE_TABLE_RENAME_STATUS
fi

# Create Private Route Table
echo -e "\n"
echo "***CREATE ROUTE TABLE***"
PRIVATE_ROUTE_TABLE_ID=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --query 'RouteTable.{RouteTableId:RouteTableId}' \
  --output text \
  --region $region 2>&1)
  ROUTE_TABLE_CREATE_STATUS=$?
if [ $ROUTE_TABLE_CREATE_STATUS -eq 0 ]; then
  echo "Route Table ID '$PRIVATE_ROUTE_TABLE_ID' CREATED."
else
    echo "Error:Route table not created!!"
    echo "$PRIVATE_ROUTE_TABLE_ID "
    exit $ROUTE_TABLE_CREATE_STATUS
fi

# Rename to Private Route Table
echo -e "\n"
echo "***RENAME PRIVATE ROUTE TABLE***"
ROUTE_TABLE_RENAME=$(aws ec2 create-tags \
  --resources $PRIVATE_ROUTE_TABLE_ID \
  --tags "Key=Name,Value=$privateRouteTableName" 2>&1)
ROUTE_TABLE_RENAME_STATUS=$?
if [ $ROUTE_TABLE_RENAME_STATUS -eq 0 ]; then
  echo "Route table ID '$PRIVATE_ROUTE_TABLE_ID' NAMED as '$privateRouteTableName'."
else
    echo "Error:ROUTE_TABLE name not added!!"
    echo " $ROUTE_TABLE_RENAME "
    exit $ROUTE_TABLE_RENAME_STATUS
fi


#Create route to Internet Gateway
echo -e "\n"
echo "***CREATE ROUTE TO IGW***"
RESULT=$(aws ec2 create-route \
  --route-table-id $PUBLIC_ROUTE_TABLE_ID \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id $IGW_ID \
  --region $region 2>&1)
RESULT_STATUS=$?
if [ $RESULT_STATUS -eq 0 ]; then
  echo "Route to '0.0.0.0/0' via Internet Gateway ID '$IGW_ID' ADDED to Route Table ID '$PUBLIC_ROUTE_TABLE_ID'."
else
    echo "Error:Route to Internet gateway not created!!"
    echo " $RESULT "
    exit $RESULT_STATUS
fi


# Associate a Route Table with a Public subnet
echo -e "\n"
echo "***BEGIN SUBNET TO ROUTE TABLE ASSOCIATION***"
Public_Associate_1=$(aws ec2 associate-route-table \
  --subnet-id $PUBLIC_SUBNET_1 \
  --route-table-id $PUBLIC_ROUTE_TABLE_ID \
  --region $region)
echo "Public Subnet ID '$PUBLIC_SUBNET_1' ASSOCIATED with Route Table ID" \
  "'$PUBLIC_ROUTE_TABLE_ID'."

echo -e "\n"
Public_Associate_2=$(aws ec2 associate-route-table  \
  --subnet-id $PUBLIC_SUBNET_2 \
  --route-table-id $PUBLIC_ROUTE_TABLE_ID \
  --region $region)
echo "Public Subnet ID '$PUBLIC_SUBNET_2' ASSOCIATED with Route Table ID" \
  "'$PUBLIC_ROUTE_TABLE_ID'."

echo -e "\n"
Public_Associate_3=$(aws ec2 associate-route-table  \
  --subnet-id $PUBLIC_SUBNET_3 \
  --route-table-id $PUBLIC_ROUTE_TABLE_ID \
  --region $region)
echo "Public Subnet ID '$PUBLIC_SUBNET_3' ASSOCIATED with Route Table ID" \
  "'$PUBLIC_ROUTE_TABLE_ID'."


# Associate a Route Table with a Private Subnet
echo -e "\n"
echo "***BEGIN SUBNET TO ROUTE TABLE ASSOCIATION***"
Private_Associate_1=$(aws ec2 associate-route-table \
  --subnet-id $PRIVATE_SUBNET_1 \
  --route-table-id $PRIVATE_ROUTE_TABLE_ID \
  --region $region)
echo "Private Subnet ID '$PRIVATE_SUBNET_1' ASSOCIATED with Route Table ID" \
  "'$PRIVATE_ROUTE_TABLE_ID'."

echo -e "\n"
Private_Associate_2=$(aws ec2 associate-route-table  \
  --subnet-id $PRIVATE_SUBNET_2 \
  --route-table-id $PRIVATE_ROUTE_TABLE_ID \
  --region $region)
echo "Private Subnet ID '$PRIVATE_SUBNET_2' ASSOCIATED with Route Table ID" \
  "'$PRIVATE_ROUTE_TABLE_ID'."

echo -e "\n"
Private_Associate_3=$(aws ec2 associate-route-table  \
  --subnet-id $PRIVATE_SUBNET_3 \
  --route-table-id $PRIVATE_ROUTE_TABLE_ID \
  --region $region)
echo "Private Subnet ID '$PRIVATE_SUBNET_3' ASSOCIATED with Route Table ID" \
  "'$PRIVATE_ROUTE_TABLE_ID'."
