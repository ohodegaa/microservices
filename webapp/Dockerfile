FROM node

RUN mkdir -p /webapp

WORKDIR /webapp

COPY package.json /webapp
COPY package-lock.json /webapp

RUN npm install
COPY . /webapp

EXPOSE 5000

CMD ["npm", "start"]

