#!/bin/bash

cd /home/ec2-user/PlannerBuddy-api/
git pull origin main
npm install
pm2 restart all
