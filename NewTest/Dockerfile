# Use an official Node.js runtime as a parent image
FROM node:21

# Set the working directory in the container to /app

WORKDIR /app

# Change to the non-root user


# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci


# Copy the local package files to the container's workspace
COPY . .

# Expose the Vite default port
EXPOSE 3000

# Start the application using Vite
CMD ["npm", "run", "dev"]