@REM This is a script to publish to build images and publish them to Docker hub automatically
@echo off

echo "Building sub-applications"
docker buildx bake --push --set *.platform=linux/amd64,linux/arm64,linux/arm/v7

echo "Done!"
pause
