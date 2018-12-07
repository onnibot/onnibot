const {
  Command
} = require('discord.js-commando');
const {
  stripIndents
} = require('common-tags');

const packageJson = require('./../../package.json');
const {
  shard
} = require('./../../bot.js');
const {
  formatMs
} = require("./../../utils/formatms.js");

const os = require('os');
const Discord = require('discord.js');

module.exports = class ChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      group: 'util',
      memberName: 'botinfo',
      description: 'Fetches info related to the bot',
      examples: ["botinfo", "botinfo adding arguments is useless"],
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 10
      },
      aliases: ["bi", "stats", "info"]
    });
  }

  async run(msg, args) {

    // Making shortcuts for ease of use
    const client = this.client;
    const me = client.user;

    let embed = new Discord.RichEmbed()

      // Sets basic info for the embed
      .setTitle(`${me.username} Stats`)
      .setThumbnail(me.avatarURL)

      // Sets the colour to the bots own roles colour
      .setColor(msg.guild.me.displayColor)

      // Formats uptime from ms to a cool format, utils/tools/formatms.js
      .setDescription(`**Uptime**: ${formatMs(client.uptime)}`)

      // Let's start adding some fields.

      .addField(
        "Specs",
        stripIndents `
        **CPU**: ${os.cpus().length}x ${(os.cpus()[0]["speed"] / 1000).toFixed(2)}GHz
        **RAM**: ${(os.totalmem() / (1024 ** 3)).toFixed(1)}gb`,
        true
      )

      .addField(
        "Versions",
        stripIndents `
        **Karma**: v${packageJson.version} (${packageJson.description})
        **NodeJS**: ${process.version}`,
        true
      )

      .addField(
        `Complete Stats`,
        stripIndents `
        **Guilds**: ${client.guilds.size * shard.count}
        **Channels**: ${client.channels.size * shard.count}
        **Shards**: ${shard.count}`,
        true
      )

      .addField(
        `Shard Stats`,
        stripIndents `
        **Guilds**: ${client.guilds.size}
        **Channels**: ${client.channels.size}
        **Shard ID**: ${shard.id}`,
        true
      );

    msg.embed(embed);
  }
};
