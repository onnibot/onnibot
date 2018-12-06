const {
  Command
} = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'arguments',
      aliases: ['args'],
      group: 'misc',
      memberName: 'arguments',
      description: 'Replies with used arguments',
      examples: ['arguments', 'arguments h lol', 'arguments hiya'],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
            key: 'arg',
            prompt: 'hi what',
            type: 'string',
            default: ''
        }
    ]
    });
  }

  run(msg, args) {
    return msg.say('Arguments: ' + args.arg);
  }
};
