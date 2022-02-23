FROM node:16

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY backend/package*.json ./
COPY constants.sh .

RUN npm install

# Bundle app source
COPY backend .

EXPOSE 3000
CMD [ "bash", "start.sh" ]