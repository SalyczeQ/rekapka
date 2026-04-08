#!/bin/sh
set -e

echo "Running database migrations..."
npx drizzle-kit migrate
echo "Migrations complete."

echo "Starting server..."
exec node server.js
