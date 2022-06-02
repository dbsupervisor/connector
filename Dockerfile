FROM node:17-slim

RUN apt update -y
RUN apt install -y build-essential python3

WORKDIR /usr/src/app
COPY ./ ./
RUN npm i

CMD ["npm", "start"]
