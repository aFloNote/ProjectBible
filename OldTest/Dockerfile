# Use the official Golang image to create a build artifact.
FROM golang:latest

# Set the working directory inside the container.
WORKDIR /app
RUN go install github.com/air-verse/air@latest
# Copy go.mod and go.sum to download dependencies.
COPY go.mod go.sum ./



# Install air for live reloading


# Copy the source code into the container.
COPY . .
# Download all dependencies.
RUN go mod download
# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the application using air for live reloading
ENTRYPOINT ["air", "-c", ".air.toml"]
