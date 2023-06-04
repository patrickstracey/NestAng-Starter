#!/bin/bash
mongoimport seed_data/users.json -d nestAng -c users --jsonArray --drop
mongoimport seed_data/acls.json -d nestAng -c acls --jsonArray --drop