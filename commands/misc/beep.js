const {
  Command
} = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'beep',
      group: 'misc',
      memberName: 'beep',
      description: 'Replies with a boop',
      examples: ['beep'],
      throttling: {
        usages: 2,
        duration: 10
      },
    });
  }

  run(msg) {
    return msg.say('Boop.');
  }
};
