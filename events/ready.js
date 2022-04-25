module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run() {
        this.client.user.setActivity(`mc.cheesecakenet.xyz`, {
            type: "PLAYING"
        });
        console.log(`${this.client.user.tag}, Watching ${this.client.users.cache.size} users and ${this.client.guilds.cache.size} servers.`);
    }
}