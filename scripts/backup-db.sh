#!/bin/bash

# MongoDB Atlas backup script
# This script uses mongodump to create a backup of the database

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL is not set in .env file"
    exit 1
fi

# Create backup directory if it doesn't exist
BACKUP_DIR="backups"
mkdir -p $BACKUP_DIR

# Generate timestamp for backup file
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP"

# Extract database name from DATABASE_URL
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Run mongodump
echo "Starting backup of database: $DB_NAME"
mongodump --uri="$DATABASE_URL" --out="$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP_FILE"

    # Compress the backup
    tar -czf "$BACKUP_FILE.tar.gz" -C "$BACKUP_DIR" "backup_$TIMESTAMP"

    # Remove the uncompressed backup directory
    rm -rf "$BACKUP_FILE"

    echo "Backup compressed: $BACKUP_FILE.tar.gz"
else
    echo "Error: Backup failed"
    exit 1
fi
