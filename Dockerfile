FROM node:16.17.0

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install app dependencies
RUN npm ci --only=production

# Bundle app source
COPY . .

# Build project
RUN npm run build

# Start bot
CMD [ "node", "build/main.js" ]
