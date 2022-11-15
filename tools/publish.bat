@REM This is a script to publish to build images and publish them to Docker hub automatically
@echo off

echo "Building sub-applications"
docker-compose build --no-cache

echo "Uploading website image"
docker push staijn/angulon:website
echo "Done!"
pause
