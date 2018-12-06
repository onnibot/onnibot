const path = require('path');
const sqlite = require('sqlite');
const config = require('./config/config.json');
const package = require('./package.json');
const {
  calcTime
} = require("./utils/calctime.js");

const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const client = new Commando.Client({
  owner: config.owner,
  commandPrefix: config.prefix,
  disableEveryone: true,
  unknownCommandResponse: false
});

client.registry
  // Registers your custom command groups
  .registerGroups([
    ['moderation', 'Moderation Commands'],
    ['misc', 'Miscellanious Commands'],
    ['jlogs', 'Join Logs']
  ])

  // Registers all built-in groups, some commands, and argument types
  .registerDefaultGroups()
  .registerDefaultTypes()
  .registerDefaultCommands({
    help: true,
    prefix: true,
    eval_: true,
    ping: false,
    commandState: false
  })

  // Registers all of your commands in the ./commands/ directory
  .registerCommandsIn(path.join(__dirname, 'commands'));

// Enables the SQLITE database
client.setProvider(
  sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.on('ready', () => {
  console.log(`Logged in:
Bot: ${client.user.tag} / ${client.user.id}
Shard: ${client.shard.id} (Shards: ${client.shard.count})
`);

  console.log(`Build info:
Name: ${package.name}
Version: ${package.version} (${package.description})
Author: ${package.author}
`);

  // Sets client status message
  client.user.setActivity(client.commandPrefix + "help |  v" + package.version + " / " + package.description + " | " + client.shard.id, {
      type: 'WATCHING'
    })
    .then(presence => console.log(`Activity set for shard ${client.shard.id}.\n \n`))
    .catch(console.error);
});

// JOIN LOGS FOR SERVERS, CHECK /commands/jlogs

client.on('guildMemberAdd', member => {

  //Let's gather some data.

  const targetChannel = member.guild.channels.find("id", member.guild.settings.get("joinLogsChannel", null));
  const autoRole = member.guild.roles.find("id", member.guild.settings.get("joinLogsAutoRole", null));
  const autoBotRole = member.guild.roles.find("id", member.guild.settings.get("joinLogsBotRole", null));

  if (targetChannel) { // If join logs is enabled (a channel is set)

    // Let's get some messages for it lol
    const titles = [
      `${member.user.username} popped up!`,
      `${member.user.username} joined in the fun!`,
      `${member.user.username} joined.`,
      `${member.user.username} clicked the invite!`
    ];

    // Chooses a random title
    title = titles[Math.floor(Math.random() * titles.length)];

    let embed = new Discord.RichEmbed()
      // Sets base info for the embed
      .setTitle(title)
      .setThumbnail(member.user.avatarURL)
      .setColor("GREEN")
      .setFooter(new Date())

      // Adds fields with info related to the member
      .addField("User", `${member.user.tag} (${member.user})`)
      .addField("ID", member.user.id)
      .addField("Account Made", `${calcTime(new Date(), member.user.createdAt)} ago`)
      .addField("Member Count", member.guild.memberCount)

    targetChannel.send({
      embed
    });

    if (member.user.bot && autoBotRole) { // If member is a bot AND auto bot role exists
      member.addRole(autoBotRole, "Join Logs (Auto Bot Role)");
    } else if (!member.user.bot && autoRole) { // If member is not a bot and auto role exists
      member.addRole(autoRole, "Join Logs (Auto Role)");
    }
  }
});

client.on('guildMemberRemove', member => {

  const targetChannel = member.guild.channels.find("id", member.guild.settings.get("joinLogsChannel"));

  if (targetChannel) {

    const titles = [`${member.user.username} left the building.`, `Bye ${member.user.username}!`,
      `See you later, ${member.user.username}.`, `${member.user.username} has disappeared.`
    ];
    title = titles[Math.floor(Math.random() * titles.length)];

    let embed = new Discord.RichEmbed()
      .setTitle(title)
      .setThumbnail(member.user.avatarURL)
      .setColor("RED")
      .setFooter(new Date())

      .addField("User", `${member.user.tag} (${member.user})`)
      .addField("ID", member.user.id)
      .addField("Account Made", `${calcTime(new Date(), member.user.createdAt)} ago`)
      .addField(`Joined ${member.guild.name}`, `${calcTime(new Date(), member.joinedAt)} ago`)
      .addField("Member Count", member.guild.memberCount)

    targetChannel.send({
      embed
    });
  }
});

client.login(config.token);
