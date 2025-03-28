FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build the React app
RUN npm run build

# Install serve to host the built app
RUN npm install -g serve

# Expose port for the app
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "build", "-l", "3000"]