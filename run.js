// Run this file instead of bot.js, allows support for sharding and launches the web server

const Discord = require('discord.js');
const nodeEnv = function() {
  switch (process.env.NODE_ENV) {
    case 'development':
      return 'dev';
    case 'production':
      return 'production';
    default:
      return 'production';
  };
};
const config = require('./config/config.json')[nodeEnv()];

const Manager = new Discord.ShardingManager('./bot.js');
Manager.spawn(config.shards);
