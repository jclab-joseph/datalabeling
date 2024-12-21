#!/bin/bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "SCRIPT_DIR: $SCRIPT_DIR"
DB_FILE=$SCRIPT_DIR/data-labeling.db

find -type f -name "*.png" -maxdepth 1 | while read IMAGE; do
	HASH=$(sha256sum $IMAGE | cut -c1-8)
	IMAGE_DATA=$(xxd -p "$IMAGE" | tr -d '\n')
	echo $HASH
	sqlite3 $DB_FILE "PRAGMA journal_mode=WAL; INSERT OR IGNORE INTO question (question_id, data) VALUES ('$HASH', X'$IMAGE_DATA');"
done

echo "Images added to database."

