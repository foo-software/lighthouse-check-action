FROM foosoftware/lighthouse-check:5

COPY . .

RUN npm install
RUN npm run build

# support a standard location for artifacts
RUN mkdir -p /tmp/artifacts

CMD [ "node", "/dist/index.js" ]
