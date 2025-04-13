# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install && npm install mongoose

# Install nodemon globally for development
RUN npm install -g nodemon


# Copy the rest of the application files
COPY . .

# Expose the port your service runs on (change as needed)
EXPOSE 5002

# Use the development start command
CMD ["npm", "run", "dev"]
