mongoimport --file=docker-entrypoint-initdb.d/users.json --jsonArray -d nestAng -c users --drop
mongoimport --file=docker-entrypoint-initdb.d/podcast.json --jsonArray -d nestAng -c users --drop