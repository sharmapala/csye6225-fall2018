#!/usr/bin/env bash
cd /home/centos/webapp
pm2 kill
pm2 start server 
