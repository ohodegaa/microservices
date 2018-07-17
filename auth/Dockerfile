FROM node

RUN mkdir -p /auth

WORKDIR /auth

COPY package.json /auth
COPY package-lock.json /auth

RUN npm install
COPY . /auth

EXPOSE 4040

CMD ["npm", "start"]