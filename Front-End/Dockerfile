FROM enoniccloud/apache2-letsencrypt

COPY myvhost.conf /etc/apache2/sites-enabled/myvhost.conf
COPY ./dist/ /var/www/html/

RUN a2enmod headers

# Build image with:         docker build . --tag angulon-frontend:latest
# Tag image as latest       docker tag angulon-frontend staijn/angulon-frontend:latest
# push to repository        docker push staijn/angulon-frontend:latest
