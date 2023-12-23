
FROM node:21.4.0

WORKDIR /app

EXPOSE 3000
# Install npm modules for app

RUN echo "Installing npm modules..." && \
    npm install || exit 1 && \
    npm run postinstall || exit 1 && \
    echo "npm modules installed." && \
    npm cache clean --force

# Copy files for app
COPY . /app

RUN npm run build

# Start app
CMD ["npm", "start"]