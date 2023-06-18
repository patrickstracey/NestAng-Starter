# Uploads

The project is setup to use Google cloud storage by default and expects to have two seperate buckets at time of
initialization. They are:

### Public images bucket

The thinking of having this public all users will need the ability to see images that have been attached to entities
stored within the database upon viewing that entity on the front-end.

### Private documents bucket

This bucket should be setup on Google Cloud to be private, and thereby require authenticated urls to view the uploaded
files. The `UploadsService` and `UploadsController` have methods that will reach out to Google Cloud and return these
authenticated URLS with a 15 minute expiration time.

Practivally this means users will see a list of pdf names on the front-end, and upon clicking on one the front-end will
await the authed URL and then open the PDF file url in a new window.

## Other Notes

The controller is setup by default to only allow admins to upload items, so please feel free to change this to match
your product's needs. Most products allow regular authed users to upload items but I typically prefer to make that
decision conciously during development.

### google.config.json

In order to intilialize your bucket connection, you need to pass a config json on connection. The `UploadsService`
handles this in the `constructor()` using the `google.config.json` file in the `Uploads` directory.

In order for this to work though you will need to ensure that you add your project specific variables to this file and
your environment file. Otherwise the `UploadsService` will fail to create a connection to your Google Cloud Storage.