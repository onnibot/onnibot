const {
  Command
} = require('discord.js-commando');
const {
  chooseRnd
} = require("./../../utils/choosernd.js");
const kaomojis = require("./../../lists/kaomojis.json")

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'emotion',
      group: 'misc',
      aliases: ['kaomoji', 'emoji', 'emoticon', 'kaomojis', 'emotions', 'emoticons', 'emojis'],
      memberName: 'emotion',
      description: 'Replies with a kaomoji to fit your mood.',
      examples: ['emotion sad', 'emotion happy'],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
            key: 'kaomoji',
            prompt: 'Which kaomoji category?\n```' + Object.keys(kaomojis).join(", ") + '```',
            type: 'string',
            validate: text => {
              // If object has wanted kaomoji category, return
              if (kaomojis.hasOwnProperty(text.toLowerCase())) return true;
              // If doesn't, return list
              return 'That is not a valid kaomoji. Please refer to this list: ```' + Object.keys(kaomojis).join(", ") + '```'
            }
        }
    ]
    });
  }

  run(msg, args) {

    const kaomojiArg = args.kaomoji.toLowerCase()
    if (kaomojis.hasOwnProperty(kaomojiArg)) {
      const kaomojiCategory = kaomojis[kaomojiArg]
      msg.say(chooseRnd(kaomojiCategory))
    } else {
      msg.say('Something went wrong')
    }

  }
};
