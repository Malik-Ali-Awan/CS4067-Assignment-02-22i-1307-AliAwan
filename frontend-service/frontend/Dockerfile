# Use node for building the frontend
FROM node:20-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json .
RUN npm install

# Copy all project files
COPY . .


# Build the frontend
#RUN npm run build

# Use nginx to serve the frontend
# FROM nginx:alpine

# # Copy the build files from the 'build' stage into Nginx's serving directory
# COPY --from=build /app/dist /usr/share/nginx/html

# # Expose Nginx's default port
# EXPOSE 80

EXPOSE 5173

# Use Nginx to serve the app
CMD ["npm", "run", "dev"]
