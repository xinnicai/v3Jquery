FROM 20.26.28.55/dcos/icloud:v3
MAINTAINER MUSHIXUN "18258829588@139.com"
ENV ICLOUD_VERSION 3~stable
ADD . /var/www/html/iCloud-v3/
WORKDIR /var/www/
CMD ["sh", "-c", "/root/start.sh"]