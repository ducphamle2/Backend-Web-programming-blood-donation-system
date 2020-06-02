#docker-compose build --no-cache
docker-compose -f ../docker-compose.yml down 
docker-compose -f ../docker-compose.yml up --build