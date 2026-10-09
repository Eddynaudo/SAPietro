#!/bin/sh
# Dopo il via libera: porta next/ nel sito vero (root). Poi aggiornare la riga app_release (build) per mandare il popup.
# Uso: tools/promote.sh <build> <versione>   es.  tools/promote.sh 2 1.1
set -e
cd "$(dirname "$0")/.."
[ -d next ] || { echo "next/ non esiste"; exit 1; }
B="$1"; V="$2"; [ -n "$B" ] && [ -n "$V" ] || { echo "uso: promote.sh <build> <versione>"; exit 1; }
for f in index.html sw.js manifest.webmanifest privacy.html avatar.png bg.webp icon-180.png icon-192.png icon-512.png icon-maskable-512.png favicon-32.png favicon.ico; do cp "next/$f" "$f"; done
sed -i "s/CHANNEL='next'/CHANNEL='prod'/; s/const APP_BUILD=[0-9]*,APP_VERSION='[^']*'/const APP_BUILD=$B,APP_VERSION='$V'/" index.html
sed -i "s/const V='daymarck-next-/const V='daymarck-/" sw.js
sed -i 's/"name":"DayMarck β","short_name":"DM β"/"name":"DayMarck","short_name":"DayMarck"/' manifest.webmanifest
rm -rf next
echo "Promosso build $B ($V). Ordine: 1) aggiornare app_release  2) commit+push."
