const {
  Command
} = require('discord.js-commando');

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
            type: 'member'
        }
    ]
    });
  }

  run(msg, args) {
    return msg.say('You wanted to kick: ' + args.member);
  }
};
