# Use an official Nginx image
FROM nginx:alpine

# Copy the build files into the default Nginx directory
COPY . /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Command to run Nginx serving the frontend
CMD ["nginx", "-g", "daemon off;"]

# Run the following commands to build and run the Docker container:
# docker build -t library-devops-frontend .
# docker run -d -p 8080:80 --name library-frontend-container library-frontend
