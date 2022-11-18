@REM This is a script to publish to build images and publish them to Docker hub automatically
@echo off

echo "Building base image cross platform and pushing to Docker Hub"
cd ../
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t staijn/angulon:nx-base --push .

echo "Done!"
pause
