
## Build a basic version of PayTM

docker build ./ -t mongodb:4.4.7-replset
docker run --name mongodb-replset22 -p 27017:27017 -d mongodb:4.4.7-replset
