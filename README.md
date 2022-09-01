
# Roadtrip Planner Backend

## Features
We believe a life without journeys is one not lived at all.
Our roadtrip planner helps you get the most out of your vacations.
Discover the most iconic restaurants & the most epic activities to do in every city in the world, so that you live your life to the fullest.

## Model
- User
- City
- Activity
- SelectedActivities
- Trip
## Route
- /user.routes
- /trip.routes
- /auth.routes
- /activities.routes
- /locationSearch.routes
- /cities.routes

## Features
- Authentication 
- Email Verifications 
- Fetching External API
- Planning

## Configuration
Here is our API link (https://roadtrip-planner-ih.herokuapp.com/api). You can find more information about how to use it in the postman documentation below.

### Postman documentation
To use our API, you can refer to our postman documentation 📜.
https://documenter.getpostman.com/view/22850983/VUxPuScf

## Getting Started

  

Make sure you have node installed.

  

$ node -v

v16.16.0
  

## Server

  

To run the server in development, just type the command `yarn dev` or `npm run dev`.

Don't forget to install node_modules with `yarn install` or `npm install`.

## Environment
  

- **PORT**

This variable is more needed to development environment but heroku also ask fo this variable.

I set it to `3003` but you are free to put it at the value you want.

  

- **SECRET**

Random token to use as a secret for JWT. To generate one, run `node`, then: `crypto.randomBytes(64).toString('hex')`

## Development dependencies
  
  This part is more for the developers on this project.
  You will find all the DevDependencies on the package.json.
