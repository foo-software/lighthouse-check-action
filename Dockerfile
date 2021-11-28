FROM foosoftware/lighthouse-check:5

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN npm install
RUN npm run build

CMD [ "node", "./dist/index.js" ]
