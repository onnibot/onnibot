const {Command} = require('discord.js-commando');

const {calcTime} = require("./../../utils/calctime.js");

const Discord = require('discord.js');

module.exports = class ChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      group: 'util',
      memberName: 'serverinfo',
      description: 'Fetches info about the server',
      examples: ["serverinfo", "serverinfo adding arguments does nothing lol"],
      guildOnly: true,
      throttling: {
          usages: 2,
          duration: 10
      },
      aliases: [
        "si",
        "server",
        "gi",
        "guild",
        "guildinfo"
      ]
    });
  }

  async run(msg, args) {

    /* Don't mind me,
    just setting some shortcuts */

    const guild = msg.guild;
    const me = this.client.user;

    // Naming moderation levels

    const verificationLevel  = [
      "None",
      "Low",
      "Medium",
      "Tableflip",
      "Double Tableflip"
    ]

    // Let's start building an embed!

    let embed = new Discord.RichEmbed()

      // Sets basic info for the embed
      .setTitle(`${guild.name} | Info`)
      .setThumbnail(guild.iconURL)

      // Sets the colour to the bots own roles colour
      .setColor(guild.me.displayColor)

      // Let's start adding some fields.

      .addField(
        "Name",
        guild.name,
        true
      )

      .addField(
        "ID",
        guild.id,
        true
      )

      .addField(
        "Region",
        guild.region,
        true
      )

      .addField(
        "Verification Level",
        verificationLevel[guild.verificationLevel],
        true
      )

      .addField(
        "Members",
        guild.memberCount,
        true
      )

      .addField(
        "Channels",
        guild.channels.size,
        true
      )

      .addField(
        "Roles",
        guild.roles.size,
        true
      )

      .addField(
        "Emojis",
        guild.emojis.size,
        true
      )

      .addField(
        "Created",
        `${calcTime(new Date(), guild.createdAt)} days ago`,
        true
      )

      .addField(
        "Owner",
        guild.owner.user.tag,
        true
      )

    // Finally sends the message
    msg.embed(embed);
  }
};
