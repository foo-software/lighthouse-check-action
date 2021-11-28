FROM foosoftware/lighthouse-check:5

COPY . .

RUN npm install
RUN npm run build

CMD [ "node", "/dist/index.js" ]
