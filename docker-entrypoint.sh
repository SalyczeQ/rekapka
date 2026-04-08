#!/bin/sh
set -e

echo "Running database migrations..."
node node_modules/drizzle-kit/bin.cjs migrate
echo "Migrations complete."

echo "Starting server..."
exec node server.js
