# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally for development
RUN npm install -g nodemon


# Copy the rest of the application files
COPY . .

# Expose the port your service runs on (change as needed)
EXPOSE 5004

# Use the development start command
CMD ["npm", "run", "dev"]
