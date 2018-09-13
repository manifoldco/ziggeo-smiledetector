# Ziggeo Smile Detector
A Smile Detector built with Ziggeo and Manifold

## Development 
```
npm i # install dependencies
manifold run -t manifold -p ziggeo-cv-demo -- npm start # begin the server
curl --header "Content-Type: application/json"  \
     --request POST \
     --data '{"videoToken":"de2839177944158707d89fe4af808207"}' http://localhost:3000/process-video # test the server
```

## Docker
```
docker build . -t smile-server:test
manifold run -t manifold -p ziggeo-cv-demo -- bash ./run-server.sh
```
