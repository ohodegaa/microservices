FROM nginx

RUN rm /etc/nginx/conf.d/default.conf
COPY proxy.conf /etc/nginx/conf.d/default.conf

COPY ./auth/.htpassw /etc/nginx/.htpassw
