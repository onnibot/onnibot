module.exports = {
  name: 'arguments',
	description: 'Returns arguments if they exist.',
	args: true,
  execute(message, args) {
		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`Arguments presented: ${args}`);
  },
};