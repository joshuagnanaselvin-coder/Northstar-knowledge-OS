#!/bin/sh
# Substitute environment variables into nginx config
envsubst '${BACKEND_URL} ${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
nginx -g "daemon off;"
