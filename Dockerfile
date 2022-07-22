# based on ubuntu
FROM ubuntu:22.04

# update apt list
RUN apt update

# install tools
RUN apt install -y ca-certificates curl udev

# add certificates into container if host device is connected to garmin internal network
# RUN mv /usr/local/share/ca-certificates/garmin_certs/*.crt /usr/local/share/ca-certificates/
COPY ./src/certs/*.crt /usr/local/share/ca-certificates/

# update certificates
RUN update-ca-certificates

# configure the environment to install latest node.js with apt install command (current version is 18.6.0)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# install nodejs
RUN apt install -y nodejs

# create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 80 1433

#CMD [ "node", "app.js" ]