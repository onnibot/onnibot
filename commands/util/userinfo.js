const {
  Command
} = require('discord.js-commando');

const {
  calcTime
} = require("./../../utils/calctime.js");

const Discord = require('discord.js');

module.exports = class ChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'me',
      group: 'util',
      memberName: 'userinfo',
      description: 'Fetches info about a user',
      examples: ["userinfo", "userinfo jaqreven"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 10
      },
      aliases: [
        "ui",
        "user",
        "me"
      ],
      args: [{
        key: 'member',
        label: 'user',
        prompt: 'Who would ya like to snoop on?',
        type: 'member',
        default: ''
      }]
    });
  }

  async run(msg, args) {

    /* Defaults to message author
    member = member stuff
    user = member.user */
    let member = args.member ? args.member : msg.member;
    let user = args.member ? args.member.user : msg.author;
    const me = this.client.user;

    // Would break if no visible roles

    let hoistRole = member.hoistRole ? member.hoistRole.name : "None";

    // Let's start building an embed!

    let embed = new Discord.RichEmbed()

      // Sets basic info for the embed
      .setTitle(`${user.tag} | Info`)
      .setThumbnail(user.avatarURL)

      // Sets the colour to the bots own roles colour
      .setColor(msg.guild.me.displayColor)

      // Let's start adding some fields.

      .addField(
        "Name",
        user.username,
        true
      )

      .addField(
        "Nick",
        member.displayName,
        true
      )

      .addField(
        "ID",
        user.id,
        true
      )

      .addField(
        "Discriminator",
        user.discriminator,
        true
      )

      .addField(
        "Bot",
        user.bot,
        true
      )

      .addField(
        "Status",
        member.presence.status,
        true
      )

      .addField(
        "Account made",
        `${calcTime(new Date(), user.createdAt)} ago`,
        true
      )

      .addField(
        "Server joined",
        `${calcTime(new Date(), member.joinedAt)} ago`,
        true
      )

      .addField(
        "Highest Role",
        member.highestRole.name,
        true
      )

      .addField(
        "Highest Visible Role",
        hoistRole,
        true
      )

      .addField(
        "Colour",
        member.displayHexColor,
        true
      )

    // Finally sends the message
    msg.embed(embed);
  }
};
