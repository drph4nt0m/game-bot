const config = {
  apps: [
    {
      name: "game-bot",
      script: "node ./dist/main.js",
      autorestart: true,
      time: true,
      watch: "./dist",
    },
  ],
};

module.exports = config;
