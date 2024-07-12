import { Command } from 'commander';
const program = new Command();

program.version('0.0.1');

program
	.command('m <message>')
	.alias('message')
	.description('Send message to Telegram Bot')
	.action((message) => {
		console.log(message);
	});

program
	.command('p <path>')
	.alias('photo')
	.description(
		'Send photo to Telegram Bot. Just drag and drop it in console after p-flag'
	)
	.action((path) => {
		console.log(path);
	});

program.parse(process.argv);
