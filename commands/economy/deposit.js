const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

const Bank = require('../../structures/currency/Bank');
const Currency = require('../../structures/currency/Currency');

module.exports = class DepositCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'deposit',
			group: 'economy',
			memberName: 'deposit',
			description: `Deposit ${Currency.textPlural} into the bank.`,
			details: `Deposit ${Currency.textPlural} into the bank.`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'money',
					label: 'amount of money to deposit',
					prompt: `how many ${Currency.textPlural} do you want to deposit?\n`,
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

	async run(msg, { money }) {
		if (money <= 0) return msg.reply(`you can't deposit 0 or less ${Currency.convert(0)}.`);

		const userBalance = await Currency.getBalance(msg.author.id);
		if (userBalance < money) {
			return msg.reply(stripIndents`
				you don't have that many ${Currency.textPlural} to deposit!
				You currently have ${Currency.convert(userBalance)} on hand.
			`);
		}

		Bank.deposit(msg.author.id, money);

		return msg.reply(`successfully deposited ${Currency.convert(money)} to the bank!`);
	}
};
