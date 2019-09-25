FROM foosoftware/lighthouse-check:latest
COPY entrypoint.sh /usr/app/entrypoint.sh
ENTRYPOINT ["/usr/app/entrypoint.sh"]
