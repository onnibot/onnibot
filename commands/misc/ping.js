const {
  Command
} = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      group: 'misc',
      memberName: 'ping',
      description: 'Replies with a pong',
      examples: ['ping'],
      throttling: {
        usages: 2,
        duration: 10
      },
    });
  }

  run(msg) {
    return msg.say('Pong.');
  }
};
