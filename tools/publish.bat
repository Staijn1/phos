@REM This is a script to publish to build images and publish them to Docker hub automatically
@echo off

echo "Building sub-applications"
docker-compose build --platform=linux/arm64,linux/amd64

echo "Uploading website image"
docker push staijn/angulon:website
echo "Uploading API image"
docker push staijn/angulon:api
echo "Done!"
pause
