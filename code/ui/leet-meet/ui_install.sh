#!/usr/bin/env bash

echo "Installing NPM packages"
npm install

echo "Building deployment"
npm run build

echo "Copying deployment artifacts to the install directory"
rsync -a build /var/www/swe6813/build

echo "Cleaning up source directory"
rm -rf build

echo "Restarting nginx"
sudo systemctl restart nginx