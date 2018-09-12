FROM node:8

WORKDIR /opt/server
COPY ./ /opt/server

RUN apt-get update && apt-get install -y cmake && npm install

EXPOSE 3000
CMD ["npm", "start"]
