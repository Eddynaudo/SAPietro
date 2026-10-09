#!/bin/sh
# Copia il sito attuale in next/ (canale di prova per l'amministratore).
# Uso: tools/stage.sh   -> poi si lavora SOLO dentro next/ fino al via libera.
set -e
cd "$(dirname "$0")/.."
rm -rf next && mkdir next
for f in index.html sw.js manifest.webmanifest privacy.html avatar.png bg.webp icon-180.png icon-192.png icon-512.png icon-maskable-512.png favicon-32.png favicon.ico; do cp "$f" next/; done
sed -i "s/CHANNEL='prod'/CHANNEL='next'/" next/index.html
sed -i "s/const V='daymarck-/const V='daymarck-next-/" next/sw.js
sed -i 's/"name":"DayMarck","short_name":"DayMarck"/"name":"DayMarck β","short_name":"DM β"/' next/manifest.webmanifest
echo "next/ pronto: https://eddynaudo.github.io/SAPietro/next/"
