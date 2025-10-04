# Use Node LTS
FROM node:20

# Set working directory
WORKDIR /shoppinglist

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install 

# Copy the rest of the source
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
