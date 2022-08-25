
# Roadtrip Planner Backend

  

## Getting Started

  

Make sure you have node installed.

  

$ node -v

v13.12.0

  

## Server

  

To run the server in development, just type the command `yarn dev` or `npm run dev`.

Don't forget to install node_modules with `yarn install` or `npm install`.

## Environment
  

- **PORT**

This variable is more needed to development environment but heroku ask also fo this variable.

I set it to `3000` but you are free to put it at the value you want.

  

- **SECRET**

Random token to use as a secret for JWT. To generate one, run `node`, then: `crypto.randomBytes(64).toString('hex')`

## Development dependencies
  
  This part is more for the developers on this project.
  You will find all the DevDependencies on the package.json.
  I set a config eslint with the `AirBnb` config, make sur your IDE is config for this.
