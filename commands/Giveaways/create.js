const Command = require("../../Base/Command");
const ms = require("ms");
const num = require("num-parse");

class GCreate extends Command {
    constructor(client) {
        super(client, {
            name: "create",
            description: "Creates giveaway.",
            usage: ["create <time> <winners> <prize>"],
            aliases: ["g-create", "create-giveaway", "giveaway-create", "gcreate", "start"]
        });
    }

    async run(message, args, Discord) {
        if (!message.member.hasPermission("MANAGE_GUILD") && !message.member.roles.cache.some(r => r.name.toLowerCase() === "giveaway")) return message.channel.send("❌ | You don't have `MANAGE_GUILD` permission or `Giveaway` role to create giveaways!");
        if (this.client.GiveawayManager.giveaways.filter((g) => g.guildID === message.guild.id && !g.ended).length + 1 > 3) return message.channel.send("❌ | Max giveaway limit `3` reached! Please try again later.");
        let time = args[0];
        if (!time) return message.channel.send("❌ | Berikan waktu yang valid : `30s 2h 3d`");
        if (ms(time) > ms("10d")) {
            return message.channel.send("❌ | Giveaway paling lama 10 hari");
        }
        let winners = args[1];
        if (!winners) return message.channel.send("❌ | Berikan jumlah pemenang yang valid `1w`, `2w`");
        winners = num(winners, 1);
        if (winners > 15) return message.channel.send("❌ | Pemenang tidak boleh lebih dari 15 orang");
        let prize = args.slice(2).join(" ");
        if (!prize) return message.channel.send("❌ | contoh `g?start 1d 2w Discord Nitro`");

        this.client.GiveawayManager.start(message.channel, {
            time: ms(time),
            winnerCount: winners,
            prize: prize,
            hostedBy: message.author,
            messages: {
                giveaway: "🎉 **Giveaway** 🎉",
                giveawayEnded: "🎊 **Giveaway Ended!** 🎊",
                timeRemaining: "Time left: **{duration}**!",
                inviteToParticipate: "React with \"🎉\" to participate!",
                winMessage: "🎊 Congrats, {winners} for winning **{prize}**!",
                embedFooter: `${this.client.user.tag}`,
                noWinner: "Nobody won because of the invalid participations!",
                hostedBy: "Hosted by: {user}",
                winners: "winner(s)",
                endedAt: "Ended at",
                units: {
                    seconds: "seconds",
                    minutes: "minutes",
                    hours: "hours",
                    days: "days"
                }
            }
        });
        if (message.deletable) message.delete();
        return;
    }
}

module.exports = GCreate;
