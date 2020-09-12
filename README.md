Serverless Dev Connector

Backend created by Serverless Framework with custom authorizer.

Auth Service: Custom Authorizer for all the Lambda functions that require JWT Token Authorization.

Profile Service: All the backend routes. Every route is lambda function behind an API Gateway

ui: Created in React JS. 90% of the code taken from Brad Traversy's course MERN Stack app Developer Connector app.

HOW to get the app running in your local ?
Pre-Requisites:
  1) AWS Account
  2) Create an IAM User and configure it with AWS CLI

Local Setup
  1) Checkout all the 3 folders. auth-service, profile-service and ui
  2) cd to auth-service
  3) RUN npm install for all the dependencies
  4) RUN the command "serverless deploy -v". This creates all the required resources in your AWS Account using serverless.yml available.
  5) cd to profile-service
  6) Repeat Steps 3 & 4
  7) cd to ui
  8) RUN npm install for all the dependencies
  9) Create .env file in the root directory and change the backend endpoint to your that you will get when you did step 6
  10) RUN npm start to get everything UP and RUNNING in local
  11) To get this app running in the cloud - There are many ways you could do. I chose AWS AMPLIFY which is very easy to deploy the app especially when you are using React Router  deploying in S3 gets tricky and requires additional configurations
  12) To deploy in AWS Amplify - Again there are multiple options - You could connect directly to github, bitbucket, gitlab or codecommit or any other repositories. Quick and dirty way I did is - RUN npm run build command from ui directory to create optimized production build and zip all the contents that gets created inside build folder(DONT ZIP THE BUILD FOLDER ITSELF DIRECTLY. ONLY ZIP THE CONTENTS INSIDE BUILD DIRECTORY)
  13) Then in AWS amplify - Choose the option of Deploy without git provider. There you will get an option to drag and drop the zip file that you created. Thats it - rest will be handled by Amplify and you will get the URL of the app
  14) Launch the URL and enjoy the app....
  
  BEST OF LUCK
    BIG BIG THanks to Brad for his course, app, and the code 
