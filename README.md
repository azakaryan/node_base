How to Configure and Run

    Requirements
        Install Node.js (>= 7.10.1 (to use async/await), use npm installed alongside NodeJs)
        Install MySQL (>= 5.7.13 (you can also use lower versions of mysql))
        Install MongoDB (>= 3.4.3)
        TODO
          ...add remaining.
        
    Configuration
        Make configuration changes in app.config.wrapper.config.js
            development (integration, staging, production)
                host
                port
                protocol
                db
                    host
                    user
                    password
                mongodbUrl
        
    Run
        Import the 
            app.db.mysql.base_node_db_schema.sql file into your database
            app.db.mysql.base_node_db_initial_data.sql file into your database
            
            If you want to use command line to import above files 
                1. login to mysql using -> mysql -u root -p   (provide password)
                2. run -> mysql -u root -p base_node < app/db/mysql/base_node_db_schema.sql -> to create the schema
                3. run -> mysql -u root -p base_node < app/db/mysql/base_node_db_initial_data.sql -> to import initial data.
        
        Install dependencies - npm install
        Run - npm start (node server.js)
        
        Requiered Environment variables: 
            NODE_ENV (development*, integration, staging, gcloud)
            LOG_LEVEL (error(0), warn(1), info(2)*, verbose(3), debug(4), silly(5))
        
        Note, * marks as default.


Api Docs
        
    Swagger
        Ip:Port/swagger. (ex. https://base_node:3000/swagger/)
        Then use https://Ip:Port/api/v1/api-docs.json to get the API's.
        (EX. https://localhost:9000/api/v1/api-docs.json)

How to run the API on remote

    Using pm2
        
        List all processes:
            pm2 list (pm2 status)
            
        Act on them:    
            start    ->  NODE_ENV=env LOG_LEVEL=level pm2 start server.js --name "api_name"
            restart  ->  NODE_ENV=env LOG_LEVEL=level pm2 restart server.js --name "api_name"(pm2 restart api_name (id))
            stop     ->  pm2 stop api_name (id)
            delete   ->  pm2 delete api_name (id)
            see logs ->  pm2 logs api_name (id)
            
        Monitoring all processes launched:
            pm2 monit
            
    For more info please see http://pm2.keymetrics.io/

How To generate a self-signed certificate,

    Run the following in your shell:

        openssl genrsa -out key.pem
        openssl req -new -key key.pem -out csr.pem
        openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
        rm csr.pem

Local .env.js file

    .env.js file is used to keep local environmental variables specific to each user.
    This is mainly used in dev mode by different developers. It helps to specify your own env variables without 
     changing config dev env. Please, create .env.js file under projects root directory with the example content:
     - each env should define it's own .env.js with it's specific env variables.

    module.exports = {
        host: '185.13.197.228',
        port: '443',
        protocol: 'https',

        db: {
            dialect: 'mysql',
            multipleStatements: true,
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'base_node'
        },
        mongodbUrl: ...,
        ...
    };    

Tests

    to run integration tests type npm test
    to run unit tests type npm tst // TODO make a general way of running tests and controlling the type from config.json

OAuth2 

    How to get Auth token
      EX. Using wget
        wget -qO- --header="Authorization: Basic ZHZfaWQ6ZHZfc2VjcmV0"  --no-check-certificate --post-data "username=armenzakary@gmail.com&password=epam1234&grant_type=password" https://localhost:9000/api/v1/oauth/token
      
    How contact the endpoint having token in place.
      EX. Using wget
        wget -qO- --header="Authorization: Bearer ea5f40ee163e5aa3faf9f4b97b9a9c8518b1ee15" --no-check-certificate https://localhost:9000/api/v1/users/current
      append  "Bearer token" to the header

    Error Responses Cases
    
        Case 1: "token Not Found"
            RESPONSE: {code: 400, name: "OAuth2Error", message: "The access token was not found", error: "invalid_request", error_description: "The access token was not found"}
        Case 2: "Token Expired"
            RESPONSE: {code: 401, name: "OAuth2Error", message: "The access token provided has expired.", error: "invalid_token", error_description: "The access token provided has expired."}
        Case 3: "Wrong Password"
            RESPONSE: {code: 401, name: "OAuth2Error", message: "The password provided is wrong.", error: "wrong_password", error_description: "The password provided is wrong."}
        Case 4: "Invalid User"
            RESPONSE: {code: 404, name: "OAuth2Error", message: "The user you are trying to access is not found.", error: "not_found", error_description: "The user you are trying to access is not found."}
        Case 5:  "Not Verified User"
            RESPONSE: {code: 403, name: "OAuth2Error", message: "The user you are trying to access is not verified.", error: "not_verified", error_description: "The user you are trying to access is not verified."}
            
        
PRODUCTION SET UP HELP
    Create a virtual machine
    mysql -> https://www.digitalocean.com/community/tutorials/how-to-install-the-latest-mysql-on-ubuntu-16-04
    mongodb -> https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/              for v3.6.2
            
     
        
TODOS
     - Cluster  Integrate.
     - Cahnge Password.
     - Docker.
     - GrathQl.
     - CI. - (Jenkins + E2E test)
     - Migrate from Swagger 1 to OpenAPI 3 which is the new version of the Swagger