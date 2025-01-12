#!/usr/bin/env bash

# Check if Node.js is installed
if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is not installed. Please install Node.js to run this application."
    exit 1
fi

npm install
npm run compile
npm start $1 $2 $3
