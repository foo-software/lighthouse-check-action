FROM foosoftware/lighthouse-check:latest
COPY entrypoint.sh /entrypoint.sh

RUN mkdir /tmp/artifacts

ENTRYPOINT ["/entrypoint.sh"]
