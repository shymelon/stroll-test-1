#!/bin/sh

set -e

echo "Waiting for Postgres..."
until pg_isready -h postgres -p 5432 -U "$POSTGRES_USER" > /dev/null 2>&1; do
  sleep 1
done

# Run migrations
echo "Running migrations..."
npx prisma migrate deploy

exec "$@"
