#!/usr/bin/env bash

echo "Configuring directory for install"
python3 -m venv source/venv

source source/venv/bin/activate

pip install -r requirements.txt
cp /var/www/.env source/.env

echo "Copying files to install directory"
cp -R . /var/www/main_service/api/

echo "Restarting apache2"
sudo systemctl restart apache2
