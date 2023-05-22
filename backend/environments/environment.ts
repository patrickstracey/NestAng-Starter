export const environment = {
  name: 'LOCAL',
  production: false,
  jwt_secret: 'temp4only_LOCAL_development_USE', //DO NOT EXPOSE THIS VALUE IN A PROD ENVIRONMENT!
  session_length: '360m',
  database: {
    mongo_uri: 'mongodb://localhost:27017', //DO NOT EXPOSE THIS VALUE IN A PROD ENVIRONMENT!
    name: 'nestAng',
  },
};
