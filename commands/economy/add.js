const { Command } = require('discord.js-commando');

const Currency = require('../../structures/currency/Currency');

module.exports = class MoneyAddCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add-money',
			group: 'economy',
			memberName: 'add',
			description: `Add ${Currency.textPlural} to a certain user.`,
			details: `Add amount of ${Currency.textPlural} to a certain user.`,
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
					label: 'amount of money to add',
					prompt: `how many ${Currency.textPlural} do you want to give that user?\n`,
					type: 'integer'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	run(msg, { member, money }) {
		Currency._changeBalance(member.id, money);
		return msg.reply(`successfully added ${Currency.convert(money)} to ${member.displayName}'s balance.`);
	}
};
