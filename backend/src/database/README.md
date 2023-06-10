# Database Module

The database Module is setup to essentially extend off the databsse provider you decide to use. Currently the project
only has a subdirectory for MongoDB but could be extended to use others in the future.

Other modules in the backend all import the `DatabaseModule` and utilize the `DatabaseService` so switching database
providers can be achieved by changing what underlying service the `DatabaseService` is extending.

The `intializeDatabase` function folows a similar principal, taking in an argument for the database connection you want
to establish and then running the relevant initialization function from the relevant subdirectory.

### Some controllers may still need to be updated directly in their services

Currently some of the back-end services do have Mongo specific functionality coded into them that may need to be
updated. This like finding a user account by email in the `UsersService` are written with the query aligning with the
MongoDB node driver. My hpe is to update this in the future.