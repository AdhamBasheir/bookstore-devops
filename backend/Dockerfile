# Use official Node.js base image
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port the backend listens on
EXPOSE 3000

# Command to start the server
CMD ["node", "server.js"]

# Run the following commands to build and run the Docker container:
# docker build -t library-devops-backend .
# docker run -d -p 3000:3000 --name library-backend-container library-devops-backend
