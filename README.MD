Перед запуском надо создать файлы:
`.env`
`.env.dev`
`.env.prod`
и по аналогии для других окружений если потребуется.

Установка модулей:
`yarn install`

Запуск через
`yarn start` или
`yarn start-dev` или
прописать свой скрипт в `package.json` по аналогии:
 "scripts": {
   "start": "cross-env NODE_ENV=prod nodemon src/server.js",
   "start-dev": "cross-env NODE_ENV=dev nodemon src/server.js"
 }
