#!/usr/bin/env bash

echo "Installing NPM packages"
npm install

echo "Building deployment"
npm run build

echo "Copying deployment artifacts to the install directory"
mv -f build /var/www/swe6813

echo "Restarting nginx"
systemctl restart nginx