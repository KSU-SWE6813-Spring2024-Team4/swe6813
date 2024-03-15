#!/usr/bin/env bash

echo "Building WAR file"

rm ./src/main/resources/application.properties
cp /var/www/application.properties ./src/main/resources/application.properties
./mvnw package -DskipTests

echo "Moving war file to deployment directory directory"
mv target/authservice-0.0.1-SNAPSHOT.war /var/www/auth_service/

echo "Starting WAR file"
java -jar /var/www/auth_service/authservice-0.0.1-SNAPSHOT.war &

echo "Restarting apache"
sudo systemctl restart apache2

