const { Client, Intents, MessageEmbed, Permissions } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES] });

const { token, prefix, groups } = require('./config.json');

client.on("ready", () => {
    console.log(`--> Bot online`);
});
client.on("messageCreate", async message => {

    msg = message.content.toLowerCase();
    md = message.content.split(" ");

    if(msg.startsWith(`${prefix}showcase`) && md[1]) {

        tt = groups.filter(t => t.name.toLowerCase() == md.slice(1).join(" ").toLowerCase());
        if(tt.length == 0) {
            embed = new MessageEmbed()
                .setColor('DARK_RED')
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setDescription(`Could not find that group.`)
            message.channel.send({embeds:[embed]});
            return
        }
        tt = tt[0];

        roles = [];
        for(i in tt.roles) {
            role = message.guild.roles.cache.find(t => t.name.toLowerCase() == tt.roles[i][0].toLowerCase());
            role ? roles.push(`<@&${role.id}>`) : roles.push(`${tt.roles[i][0]}`);
        }

        embed = new MessageEmbed()
            .setColor('DARK_BLUE')
            .setFooter(`Preview`)
            .setTitle(tt.name)
            .setDescription(roles.join(`\n`))
        message.channel.send({embeds:[embed]});
    }
    if(msg.startsWith(`${prefix}add`) && md[1]) {

        tt = groups.filter(t => t.name.toLowerCase() == md.slice(1).join(" ").toLowerCase());
        if(tt.length == 0) {
            embed = new MessageEmbed()
                .setColor('DARK_RED')
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setDescription(`Could not find that group.`)
            message.channel.send({embeds:[embed]});
            return
        }
        tt = tt[0];

        for(i in tt.roles) {

            data = {
                name: tt.roles[i][0],
                color: tt.roles[i][1],
                reason: 'Updates...',
            };

            if(tt.roles[i][2] == true) {
                data = {
                    name: tt.roles[i][0],
                    color: tt.roles[i][1],
                    reason: 'Updates...',
                    permissions: [Permissions.FLAGS.ADMINISTRATOR]
                }
            }

            await message.guild.roles.create(data);
        }

        embed = new MessageEmbed()
            .setColor('DARK_BLUE')
            .setDescription(`Roles have been created.`)
        message.channel.send({embeds:[embed]});
    }
    if(msg.startsWith(`${prefix}delete`) && md[1]) {

        tt = groups.filter(t => t.name.toLowerCase() == md.slice(1).join(" ").toLowerCase());
        if(tt.length == 0) {
            embed = new MessageEmbed()
                .setColor('DARK_RED')
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setDescription(`Could not find that group.`)
            message.channel.send({embeds:[embed]});
            return
        }
        tt = tt[0];

        for(i in tt.roles) {
            role = message.guild.roles.cache.find(t => t.name.toLowerCase() == tt.roles[i][0].toLowerCase());
            if(role) await role.delete();
        }

        embed = new MessageEmbed()
            .setColor('DARK_BLUE')
            .setDescription(`Roles have been deleted.`)
        message.channel.send({embeds:[embed]});
        return
    }
    if(msg.startsWith(`${prefix}delete`) && !md[1]) {

        message.guild.roles.cache.forEach(async role => {
            try {
                role.delete().catch(err => {});
            } catch(err) {};
        });

        embed = new MessageEmbed()
            .setColor('DARK_BLUE')
            .setDescription(`Roles have been deleted.`)
        message.channel.send({embeds:[embed]});
        return
    }
});

client.login(token);