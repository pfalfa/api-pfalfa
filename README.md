# Pfalfa API

API for handle internal information dApps and logs activity

## Configuration

```bash
# Rename .env.example to be .env
$ cp .env.example .env

# Complete the required in line
$ sudo nano .env

# DYNAMO DB
REGION='change your region in aws'
ACCESS_KEY_ID='change your access key id'
SECRET_ACCESS_KEY='change your secret access key'

# API IDENTITY HUB
HOST_IHUB='http://host-identity-hub-api:3003/api'
```

## Usage

```bash
# Install depedencies
$ npm install

# Run application
$ npm run start
```

## Using Docker

```bash
# Build docker image
$ docker build -t pfalfa-api .

# Run docker container
$ docker run --name pfalfa-api -d -p 3033:3033 pfalfa-api
```

## API Doc

Host API  : http://localhost:3033  
Header    : Authorization = pubkey  
Body      : JSON  

| Method  | Endpoint        | Information                                                   |
| ------- | --------------- | ------------------------------------------------------------- |
| GET     | /api/dapps      | Get paginate data dapps                                       |
| GET     | /api/dapps/:id  | Get data dapps by Id                                          |
| POST    | /api/dapps      | Created new dapp. Required is domain, pubkey, hash, status    |
| PUT     | /api/dapps/:id  | Updated dapp by Id. Required is domain, pubkey, hash, status  |
| DELETE  | /api/dapps/:id  | Deleted dapp by Id                                            |

