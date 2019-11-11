################################################################
# How to :
# Build : docker build -t pfalfa-api .
# Run : docker run --name pfalfa-api -d -p 3033:3033 pfalfa-api
################################################################

FROM node:10

WORKDIR /usr/src/app
COPY . .

RUN npm install

EXPOSE 3033
CMD ["npm", "run", "start"]
