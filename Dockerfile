FROM node:20-alpine AS builder

RUN apk add --no-cache git

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

ENV NODE_OPTIONS=--max-old-space-size=4096

RUN yarn build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY /nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
