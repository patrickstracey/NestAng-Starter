#!/bin/bash
mongoimport seed_data/users.json -d nestAng -c users --jsonArray --drop