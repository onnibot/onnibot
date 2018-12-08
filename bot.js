const path = require('path');
const sqlite = require('sqlite');
const config = require('./config/config.json');
const packageJson = require('./package.json');
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

exports.shard = new Discord.ShardClientUtil(client);

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
Name: ${packageJson.name}
Version: ${packageJson.version} (${packageJson.description})
Author: ${packageJson.author}
`);

  // Sets client status message
  client.user.setActivity(client.commandPrefix + "help |  v" + packageJson.version + " / " + packageJson.description + " | " + client.shard.id, {
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
      `${member.user.username} clicked the invite!`,
      `${member.user.username} is now a member. It's time for the ritual.`,
      `It's a bird! It's a plane! It's ${member.user.username}!`,
      `${member.user.username} IS HERE (・∀・)ノ`
    ];

    // Chooses a random title
    title = titles[Math.floor(Math.random() * titles.length)];

    const embed = new Discord.RichEmbed()
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

    const titles = [
      `${member.user.username} left the building.`, `Bye ${member.user.username}!`,
      `See you later, ${member.user.username}.`, `${member.user.username} has disappeared.`,
      `It's sad to see you go, ${member.user.username}. :(`, `${member.user.username}, hope you enjoyed your stay!`
    ];
    title = titles[Math.floor(Math.random() * titles.length)];

    const embed = new Discord.RichEmbed()
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

/*
 *
 * HELL
 *
 */

client.getGuildData = function(id) { // server is a circular object so I have to make my own object
  const guild = client.guilds.find("id", id);
  if (guild) {
    const json = { // Guild name and empty array
      "name": guild.name,
      "roles": []
    };
    const colourRoles = guild.roles.array().filter( // only colour roles
      role =>
      role.name.toLowerCase().startsWith("colour ") &&
      !(role.name.toLowerCase().startsWith("colour u-"))
    );
    colourRoles.forEach(role => // push each role into array
      json["roles"].push({
        "name": role.name,
        "colour": role.hexColor,
        "id": role.id
      })
    )
    return json; // return json
  } else {
    return false; // return false so the main process knows which one to pick
  }
}

client.getUserAndGuildData = function(id, guildid) {
  const user = client.users.find("id", id);
  const guild = client.guilds.find("id", guildid);
  if (user && guild) {
    const member = guild.members.get(id)
    const coloursRole = guild.settings.get('color-role');
    const hexColoursRole = guild.settings.get('hexColor');
    const perms = member ? member.hasPermission("MANAGE_ROLES") : false;
    return {
      "manageRoles": perms,
      "avatar": user.displayAvatarURL,
      "name": user.displayName,
      "tag": user.tag,
      "canUseColours": coloursRole ? member.roles.exists('id', coloursRole) : true,
      "canUseHex": hexColoursRole ? member.roles.exists("id", hexColoursRole) : false
    }
  } else {
    return client.getUserData(id)
  }
}

client.getUserData = function(id) {
  const user = client.users.find("id", id);
  if (user) {
    return {
      "avatar": user.displayAvatarURL,
      "name": user.username,
      "tag": user.tag
    }
  } else {
    return false;
  }
}

client.getAllServers = function(options) {
  const json = []
  client.guilds.forEach(function(guild) {
    const colourRoles = guild.roles.array().filter( // only colour roles
      role =>
      role.name.toLowerCase().startsWith("colour ") &&
      !(role.name.toLowerCase().startsWith("colour u-"))
    );

    const roles = colourRoles.map(role => // push each role into array
      ({
        "name": role.name,
        "colour": role.hexColor,
        "id": role.id
      })
    )

    let allRoles;
    if (options.allroles) {
      const actualRoles = guild.roles.array().filter(
        role => !role.name.toLowerCase().startsWith("colour ") && !role.managed
      )
      allRoles = actualRoles.map(role => ({
        "name": role.name,
        "id": role.id
      }))
    }

    json.push({
      "hexRole": guild.settings.get('hexColor'),
      "name": guild.name,
      "id": guild.id,
      "iconurl": guild.iconURL ? guild.iconURL : "https://discordapp.com/assets/81d74b2ebb053fbccee41865a47d48c3.svg",
      "roles": roles,
      "allroles": options.allroles ? allRoles : null,
      "restrictRole": guild.settings.get('color-role')
    })

  })
  return json;
}


client.login(config.token);
