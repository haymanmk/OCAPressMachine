# Introduction

This folder stores the codes of server side function.

# Dockerize

## How to build image

Open terminal. Change the direction to where the Dockerfile is stored, and type in following command.

```dockerfile
docker buildx build --platform=linux/arm64/v8 -t haymanmk/nodejs18:latest --load  -f ./Dockerfile.NodeJs .
```

The host machine you used to build this image will decide the platforms this image is compatible with. In order to make this image running on the target platform(s) that is(are) not supported by default on your host machine, the parameter `--platform` can help to specify the target, in addition, this parameter is available only when `buildx` is implemented. By the way, using `buildx` will download necessary files form their cloud repositories. If your host machine is connecting to the network with firewall or cyber security policy, this fetching requests might be abandoned by the cyber security mechanism. After the image is successfully built, the image is stored in a cache, in order to access it on your local host machine, the parameter `--load` should be added in. Otherwise, you are not able to see the image on the host. The last important thing is the `.`, dot, at the end of the command, this dot stands for current folder which tells docker builder where the Dockerfile stays at. If there are multiple Dockerfiles for various functions of images, the naming of Dockerfile can help us to distinguish each files of different purposes. For instances, `Example.Dockerfile` or `Dockerfile.Example ` are both acceptable for docker builder. To build image with specific Dockerfile, there is a parameter, `-f [DockerfileName]`, should be added.

## How to run Docker Image on a container

First thing first, open terminal and change direction to the folder of the code. Command the following line in tdhe terminal.

```dockerfile
docker run --rm --privileged -v /run:/run -v $(pwd):/usr/src/app -p 80:80 -p 1433:1433 haymanmk/nodejs18:latest
```
