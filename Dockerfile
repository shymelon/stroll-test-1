FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/dist/src ./dist
COPY --from=builder /usr/src/app/dist/seed.js ./
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

RUN apk add --no-cache postgresql-client

COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh


EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
CMD [ "node", "dist/index.js" ]
