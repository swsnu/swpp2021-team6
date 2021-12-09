FROM node:14.17.6
WORKDIR /usr/app
COPY package.json .
COPY src/ src/
COPY public/ public/
RUN npm install --silent
RUN npm run build --prod --silent

RUN apt-get update && apt-get install -y nginx

COPY nginx.conf /etc/nginx/sites-enabled/nginx.conf
RUN rm /etc/nginx/sites-enabled/default
RUN ln -sf /etc/nginx/sites-available/nginx.conf /etc/nginx/sites-enabled/
RUN mkdir -p /usr/share/nginx/html
RUN cp -r build/* /usr/share/nginx/html/
CMD ["nginx", "-g", "daemon off;"]
