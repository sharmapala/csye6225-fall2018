#!/usr/bin/env bash
cd /home/centos/webapp
pm2 kill
NODE_ENV=dev RDS_HOSTNAME=csye6225-fall2018.coh3ahyiuez7.us-east-1.rds.amazonaws.com RDS_USERNAME=csye6225master RDS_PASSWORD=csye6225password BUCKETNAME=csye6225-fall2018-sharmapa.me DEPLOYMENT_GROUP_NAME=deploy pm2 start server 
