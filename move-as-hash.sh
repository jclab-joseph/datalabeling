#!/bin/bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

find -type f -name "*.png" -maxdepth 1 | while read IMAGE; do
	HASH=$(sha256sum $IMAGE | cut -c1-8)
	IMAGE_DATA=$(xxd -p "$IMAGE" | tr -d '\n')
	mv ${IMAGE} ${HASH}.png
done

echo "Images added to database."

