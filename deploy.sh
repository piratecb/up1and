#! /bin/bash

SITE_PATH='/var/www/days'

cd $SITE_PATH
git reset --hard origin/master
git clean -f
git pull
git checkout master

chmod +x deploy.sh

npm install
npm run build

supervisorctl restart days
service nginx restart