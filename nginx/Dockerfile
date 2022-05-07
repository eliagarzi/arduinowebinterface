FROM nginx;

WORKDIR /var/www/nginx/html/

RUN apt update

COPY ./frontend .

RUN rm /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/

RUN chown -R www-data:www-data /var/www/nginx/html/frontend

RUN chmod 775 /var/www/nginx/html/frontend
