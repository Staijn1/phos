@echo off
@REM This script is meant to only run one time.
@REM It creates a new builder for docker buildx and initializes it.


@REM Create a new builder
docker buildx create --name mybuilder

@REM Initialize the builder
docker buildx use mybuilder

pause
