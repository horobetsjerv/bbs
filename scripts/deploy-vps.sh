#!/usr/bin/env bash
# Деплой сайта на VPS ukraine.com.ua (bbs.in.ua). Запуск из корня репозитория:
#   bash scripts/deploy-vps.sh
# Заливает код в /var/www/bbs/incoming, дальше /usr/local/bin/bbs-deploy на
# сервере собирает новую версию рядом с работающей и переключает на неё
# только после успешной сборки (иначе остаётся прежняя).
# Настройки (база, пароли) — на сервере в /etc/bbs/bbs.env, сюда не попадают.
set -euo pipefail

HOST="${BBS_HOST:-root@185.25.118.13}"

cd "$(dirname "$0")/.."
if [ -n "$(git status --porcelain)" ]; then
  echo "Есть незакоммиченные изменения — они тоже уедут на сервер:"
  git status --short
fi

rsync -az --delete \
  --exclude node_modules --exclude .next --exclude '.env*' --exclude .vercel \
  --exclude .git --exclude public/uploads \
  ./ "$HOST:/var/www/bbs/incoming/"
ssh "$HOST" /usr/local/bin/bbs-deploy
