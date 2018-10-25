#!/usr/bin/env bash
set -e
cd /home/centos
sudo cp .env webapp
cd webapp
sudo chmod 666 .env
npm install
npm install dotenv 

# setup NODE_ENV
#export RDS_HOSTNAME=csye6225-fall2018.coh3ahyiuez7.us-east-1.rds.amazonaws.com
#export RDS_USERNAME=csye6225master
#export RDS_PASSWORD=csye6225password
#export RDS_PORT=3306

export DEPLOYMENT_GROUP_NAME=deploy
if [ ! -z "$DEPLOYMENT_GROUP_NAME" ]; then
    export NODE_ENV=$DEPLOYMENT_GROUP_NAME

    hasEnv=`grep "export NODE_ENV" ~/.bash_profile | cat`
    if [ -z "$hasEnv" ]; then
        echo "export NODE_ENV=$DEPLOYMENT_GROUP_NAME" >> ~/.bash_profile
    else
        sed -i "/export NODE_ENV=\b/c\export NODE_ENV=$DEPLOYMENT_GROUP_NAME" ~/.bash_profile
    fi
fi

# add node to startup
hasRc=`grep "su -l $USER" /etc/rc.d/rc.local | cat`
if [ -z "$hasRc" ]; then
    sudo sh -c "echo 'su -l $USER -c \"cd ~/node;sh ./run.sh\"' >> /etc/rc.d/rc.local"
fi
