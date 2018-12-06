// Run this file instead of bot.js, allows support for sharding.

const Discord = require('discord.js');
const config = require('./config/config.json');

const Manager = new Discord.ShardingManager('./bot.js');
Manager.spawn(config.shards);
