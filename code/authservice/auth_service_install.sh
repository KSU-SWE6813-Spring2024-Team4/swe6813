#!/usr/bin/env bash

echo "Building WAR file"

whoami

./mvnw package -DskipTests

echo "Moving war file to target directory"

