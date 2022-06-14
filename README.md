# CSV Application Web

## Setting up
1. Currently the package manager being used is pnpm but if you are using npm on your side then just delete the pnpm-lock.yaml and run a npm install
2. Run the code "npm run start" and the application should be running on port 3000

## Things to note
1. Currently test cases are not implemented due to time constraint
2. Webpage may not be fully responsive as did not have enough time on my side to conduct full testing however main functionalities are completed
3. The axios calls are all pointing to port 8080 so if the spring boot application on your end is not port 8080, you might need to update the .env file