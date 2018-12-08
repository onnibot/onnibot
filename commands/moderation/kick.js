const {
  Command
} = require('discord.js-commando');

const Discord = require('discord.js');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      guildOnly: true,
      group: 'moderation',
      memberName: 'kick',
      description: 'Kicks a person from the guild',
      examples: ['kick @badPerson', 'kick badperson'],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
            key: 'member',
            prompt: 'Who would you like to kick from the server?',
            type: 'member',
            /*validate: member => {
              // If bot can kick member
              console.log(member)
              console.log(member.kickable)
              if (member.kickable) return true;
              // If can't, return message
              return "Sorry, but I can't kick the member due to missing permissions or too low of a role.";
            }*/
        },
        {
            key: 'reason',
            prompt: 'Why will the member be kicked?',
            type: 'string',
            default: 'No reason set!'
        }
    ]
    });
  }

  run(msg, args) {
    const member = args.member;
    const user = args.member.user;

    const discordReason = `${args.reason} | Executed by ${msg.author} / ${msg.author.tag}`;

    args.member.kick(discordReason);

    const embed = new Discord.RichEmbed()

      // Sets basic info for the embed
      .setTitle(`${user.tag} has been kicked from the server.`)
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
        "Command executer",
        `${msg.author} / ${msg.author.tag}`,
        true
      )

      .addField(
        "Reason for kick",
        `${args.reason}`,
        true
      )

    // Finally sends the message
    msg.embed(embed);
  }
};
