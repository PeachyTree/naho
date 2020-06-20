const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

const Currency = require('../../structures/currency/Currency');

module.exports = class MoneyTradeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'trade',
			group: 'economy',
			memberName: 'trade',
			description: `Trades the ${Currency.textPlural} you have earned.`,
			details: `Trades the amount of ${Currency.textPlural} you have earned.`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'member',
					prompt: `what user would you like to give ${Currency.textPlural}?\n`,
					type: 'member'
				},
				{
					key: 'money',
					label: 'amount of money to trade',
					prompt: `how many ${Currency.textPlural} do you want to give that user?\n`,
					validate: money => /^(?:\d+|all|-all|-a)$/g.test(money),
					parse: async (money, msg) => {
						const balance = await Currency.getBalance(msg.author.id);

						if (['all', '-all', '-a'].includes(money)) return parseInt(balance);

						return parseInt(money);
					}
				}
			]
		});
	}

	async run(msg, { member, money }) {
		if (member.id === msg.author.id) return msg.reply(`you can't trade ${Currency.textPlural} with yourself, ya dingus.`); // eslint-disable-line
		if (member.user.bot) return msg.reply(`don't give your ${Currency.textPlural} to bots: they're bots, man.`);
		if (money <= 0) return msg.reply(`you can't trade 0 or less ${Currency.convert(0)}.`);

		const userBalance = await Currency.getBalance(msg.author.id);
		if (userBalance < money) {
			return msg.reply(stripIndents`
				you don't have that many ${Currency.textPlural} to trade!
				You currently have ${Currency.convert(userBalance)} on hand.
			`);
		}

		Currency.removeBalance(msg.author.id, money);
		Currency.addBalance(member.id, money);

		return msg.reply(`${member.displayName} successfully received your ${Currency.convert(money)}!`);
	}
};
