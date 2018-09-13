docker run --rm -p 3000:3000 \
    -e ZIGGEO_APP_TOKEN=$ZIGGEO_APP_TOKEN \
    -e ZIGGEO_PRIVATE_KEY=$ZIGGEO_PRIVATE_KEY \
    -e ZIGGEO_ENCRYPTION_KEY=$ZIGGEO_ENCRYPTION_KEY \
    drosati/ziggeo-smiledetector:latest
