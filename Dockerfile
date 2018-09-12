FROM m03geek/ffmpeg-opencv-node:alpine-10.3.0

WORKDIR /opt/server
COPY ./ /opt/server

RUN apk update && apk add -u --no-cache python make g++
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
