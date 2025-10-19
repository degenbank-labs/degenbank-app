# Use Bun as the base image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN bun run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["bun", "start"]