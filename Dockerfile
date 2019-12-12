################################################################
# How to :
# Build : docker build -t pfalfa-api .
# Run : docker run --name pfalfa-api -d -p 3033:3033 pfalfa-api
################################################################

FROM node:10

# setting the work directory
WORKDIR /app

# copy sources
COPY . .

# install dependencies
RUN npm install

# expose port
EXPOSE 3033

# execute
CMD [ "node", "index.js" ]
