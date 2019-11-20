#!/bin/bash

# Build the mesh library
node_modules/.bin/oneisland-babler lib

# Print out the success message
echo -e "\n\e[32m✔ Successfully completed build for mesh library \n\e[0m"
