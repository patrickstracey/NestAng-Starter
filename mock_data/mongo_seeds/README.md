If you are running MongoDB locally you can use the `seed.sh` bash script included in this directory to quickly populate your database with some starter data. The file is hard coded to set `nestAng` as the database name though so don't forget to update that directly in the seed file like so:

```
mongoimport users.json -d {{your_database_name}} -c users --jsonArray --drop
```

## Setting Up MongoDB
If you would like to use MongoDB for your project and need to get it up and running on your local machine, [check out the installation docs here](https://www.mongodb.com/docs/manual/administration/install-community/). 

I also find their [Compass tool](https://www.mongodb.com/products/compass) to also be excellent for viewing collections in an intuitive UI both locally and for more cloud based Atlas deployments. 

## Starting with custom db location
Once you have setup MongoDB locally you should have already denoted the default path for mongod to utilize when running and can thereby intialize the database with this exact command:

` sudo mongod --dbpath ~/data/db`

## Importing specific files from JSON
As your project grows and you begin adding database collections specific to your project, you will probably want to add your own seed jsons and update the bash script to include them. This can be done by adding the following line to `seed.sh`.

`mongoimport {{filename}}.json -d {{your_database_name}} -c {{desired_collection_name}} --jsonArray --drop`

- `mongoimport`: command to intiate an document import
- `concerns.json`: location and name of file to import
- `-d`: database name
- `-c`: collection name
- `jsonArray`: structure of the data being imported from the file
- `--drop`: if the collection already exists, drop it. Remove this to append items to existing collection.

## Using the custom bash command to seed locally
In order to run the seed script, navigate into the directory that has the `seed.sh` file (as of writing it was found in `./mock_data/mongo_seeds`) from your terminal/command line and simply type:
`./seed.sh`.

You should then see each line of the file run individually and your database will be seeded!
