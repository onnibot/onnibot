module.exports = {
  name: 'beep',
  description: 'Boop!',
  cooldown: 5,
  execute(message, args) {
    message.channel.send('Boop.');
  },
};