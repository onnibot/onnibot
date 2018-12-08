const {
  Command
} = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'emotion',
      group: 'misc',
      memberName: 'emotion',
      description: 'Replies with a kaomoji to fit your mood.',
      examples: ['emotion sad', 'emotion happy'],
      throttling: {
        usages: 2,
        duration: 10
      },
    });
  }

  run(msg, args) {
    function choose(choices) {
      var index = Math.floor(Math.random() * choices.length);
      return choices[index];
    }
  }

  var happy = ['(* ^ ω ^)', '(* ^ ω ^)', '٩(◕‿◕｡)۶'];
  var sad = ['(ノ_<。)', 'o(TヘTo)', '(╥_╥)'];
  var angry = ['(＃`Д´)', 'ヾ(`ヘ´)ﾉﾞ', '(╬`益´)'];
  var scared = ['(″ロ゛)', '＼(º □ º l|l)/', 'Σ(°△°|||)︴'];

  switch(args[0]){
    case 'happy':
      return msg.say(choose(happy));
      break;
    case 'sad':
      return msg.say(choose(sad));
      break;
    case 'angry':
      return msg.say(choose(angry));
      break;
    case 'scared':
      return msg.say(choose(fear));
      break;
  }
};
