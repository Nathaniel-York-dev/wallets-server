## Wallets Server
This project is only for practice my backend skills, so it's not a real wallet.

This project it's the server side of [my-wallet](https://github.com/Nathaniel-York-dev/my-wallet.git) project
this project use sqlite3 as database and express as server
### Installation
```bash
npm install
```
### Run
```bash
npm start
```
### Configuration
The express server can be configured in the file environment/.env

example:
```text
PORT=${numer}
GENERATE_TABLES=${true|false}
NODE_ENV=${development|production}
DB_NAME=${name}
DB_PATH=${path}
SALT=${size_of_salt}
PEPPER=${size_of_pepper}
API_KEY=${api_key}
JWT_SECRET=${jwt_secret}
```
#### Explanation
- PORT: the port of the server
- GENERATE_TABLES: if true the server will generate the tables in the database
- NODE_ENV: the environment of the server
- DB_NAME: the name of the database
- DB_PATH: the path of the database
- SALT: the size of the salt
- PEPPER: the size of the pepper
- API_KEY: the api key for the server
- JWT_SECRET: the secret for the jwt

### API
### User Management
#### Create User
```text
POST /user
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
###### Body
```json
{
    "email":     "email",
    "password": "password"
}
```
##### Response
###### Body Success
```json
{
    "message": "${message}"
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```

#### Read User
```text
GET /user/:id
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
##### Response
###### Body Success
```json
{
    "message": "${message}",
    "user": {
        "id": "${id}",
        "email": "${email}"
    }
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```
#### Update User
```text
PUT /user/:id
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
###### Body
```json
{
    "email":     "email",
    "password":  "password",
    "name":      "name"
}
```
##### Response
###### Body Success
```json
{
    "message": "${message}"
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```
#### Delete User
```text
DELETE /user/:id
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
##### Response
###### Body Success
```json
{
    "message": "${message}"
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```

### Wallet Management
#### Create Card
```text
POST /card
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
###### Body
```json
{
    "user_id": "${user_id}",
    "name":    "${name}",
    "number":  "${number}",
    "cvv":     "${cvv}"
}
```
##### Response
###### Body Success
```json
{
    "message": "${message}"
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```

#### Read Card
```text
GET /card/:id
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
##### Response
###### Body Success
```json
{
    "message": "${message}",
    "card": {
        "id": "${id}",
        "user_id": "${user_id}",
        "name": "${name}",
        "number": "${number}",
        "cvv": "${cvv}"
    }
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```

#### Update Card
```text
PUT /card/:id
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
###### Body
```json
{
    "user_id": "${user_id}",
    "name":    "${name}",
    "number":  "${number}",
    "cvv":     "${cvv}"
}
```
##### Response
###### Body Success
```json
{
    "message": "${message}"
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```

#### Delete Card
```text
DELETE /card/:id
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
##### Response
###### Body Success
```json
{
    "message": "${message}"
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```

### Transaction Management
#### Create Transaction
```text
POST /transaction
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
###### Body
```json
{
    "user_id":      "${user_id}",
    "card_id":      "${card_id}",
    "amount":       "${amount}",
    "description":  "${description}"
}
```
##### Response
###### Body Success
```json
{
    "message": "${message}"
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```

#### Read Transaction
```text
GET /transaction/:id
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
##### Response
###### Body Success
```json
{
    "message": "${message}",
    "transaction": {
        "id": "${id}",
        "user_id": "${user_id}",
        "card_id": "${card_id}",
        "amount": "${amount}",
        "description": "${description}"
    }
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```

#### Update Transaction
```text
PUT /transaction/:id
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
###### Body
```json
{
    "user_id":      "${user_id}",
    "card_id":      "${card_id}",
    "amount":       "${amount}",
    "description":  "${description}"
}
```
##### Response
###### Body Success
```json
{
    "message": "${message}"
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```

#### Delete Transaction
```text
DELETE /transaction/:id
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
##### Response
###### Body Success
```json
{
    "message": "${message}"
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```

### Balance Management

#### Create Balance
```text
POST /balance
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
###### Body
```json
{
    "user_id": "${user_id}",
    "amount":  "${amount}"
}
```
##### Response
###### Body Success
```json
{
    "message": "${message}"
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```

#### Read Balance
```text
GET /balance/:id
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
##### Response
###### Body Success
```json
{
    "message": "${message}",
    "balance": {
        "id": "${id}",
        "user_id": "${user_id}",
        "amount": "${amount}"
    }
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```

#### Update Balance
```text
PUT /balance/:id
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
###### Body
```json
{
    "user_id": "${user_id}",
    "amount":  "${amount}"
}
```
##### Response
###### Body Success
```json
{
    "message": "${message}"
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```

#### Delete Balance
```text
DELETE /balance/:id
```
##### Request
###### Headers
```text
Authorization: ${API_KEY}
```
##### Response
###### Body Success
```json
{
    "message": "${message}"
}
```
###### Body Error
```json
{
    "message": "${message}",
    "error": "${error}"
}
```


