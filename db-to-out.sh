#!/bin/bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "SCRIPT_DIR: $SCRIPT_DIR"
DB_FILE=$SCRIPT_DIR/data-labeling.db

SQL_QUERY="SELECT q.question_id, a.answer, HEX(q.data)
FROM question q
INNER JOIN answer a ON a.question_id = q.question_id
GROUP BY a.answer"

rm -rf out
mkdir -p out
i=1
sqlite3 "$DB_FILE" "$SQL_QUERY" | while IFS='|' read -r FILENAME ANSWER BLOB_HEX; do
	OUTNAME="./out/${ANSWER}.${i}.png"
	echo $OUTNAME
	echo "$BLOB_HEX" | xxd -r -p > "./out/${ANSWER}.${i}.png"
	i=$((i+1))
done

echo "Images added to database."

