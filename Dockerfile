# Use the official Nginx image from Docker Hub
FROM nginx:alpine

# Copy the game files into the Nginx container
COPY . /usr/share/nginx/html

# Expose port 80 to access the app in the browser
EXPOSE 80
