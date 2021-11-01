const Discord = require("discord.js");
const fetch = require('node-superfetch');
const prefix = "?";
const fs = require("fs");

const Client = new Discord.Client({ disableMentions: 'everyone', partials: ['MESSAGE', 'GUILD_MEMBER', 'REACTION'] });

Client.commands = new Discord.Collection();
Client.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0) {
        console.log("Couldn't find any commands!");
        return;
    }

    jsfile.forEach((f) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        Client.commands.set(props.help.name, props);

        props.help.aliases.forEach(alias => {
            Client.aliases.set(alias, props.help.name);
        })
    })
})

Client.on('ready', async()=>{
    console.log("Bot is online");
    Client.user.setActivity('working hard! | use "?help"');
})

Client.on('guildMemberAdd', async (member) =>{
    let unverifiedRole = member.guild.roles.cache.find(unverify => unverify.id == "904665956943540244");
    if(!unverifiedRole) return;
    member.roles.add(unverifiedRole);
})

Client.on('messageReactionAdd', async (reaction, member) =>{
    console.log("Happen");
    const channel_id = reaction.message.channel.id
    const message_id = reaction.message.id
    if(reaction.message.id == "904686933559607347"){
        if(reaction.emoji.name === "✅"){
            let unverifiedRole = reaction.message.guild.roles.cache.find(unverify => unverify.id == "904665956943540244");
            if(!unverifiedRole) return;
            try{
                reaction.message.guild.member(member).roles.remove(unverifiedRole);

            } catch(err){
                console.log(err)
                return;
            }
        }
    }
})

Client.on('message', async (message)=>{
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLocaleLowerCase();
    let command;

    if(Client.commands.has(cmd)) {
        command = Client.commands.get(cmd);
    } else if(Client.aliases.has(cmd)) {
        command = Client.commands.get(Client.aliases.get(cmd));
    }
    try {
        command.run(Client, message, args);
    } catch (e) {
        //return;
    }

    if(!message.content.startsWith(prefix)) return;

    if(message.content.startsWith(prefix + "hello")){
        message.channel.send("Hello! :grin: ");
    }
    
    let image2 = "https://yt3.ggpht.com/ytc/AKedOLS0EQiGsh1IAjK8S-6ZsfjVA2qflVtRAgQ-S6R1=s176-c-k-c0x00ffffff-no-rj"

    if(message.content.startsWith(prefix + "help")){
        const commandsEmbed = new Discord.MessageEmbed()
        .setTitle('Help Commands')
        .addField("`" + prefix + 'ytstats`', "YouTube statistics for The GCSE Maths Tutor", true)
        .addField("`" + prefix + 'hello`', "oh my god oh my god its reeeall, gcse maths tutor has hi to me ohhhh", true)
        .addField("`" + prefix + 'poll`', "Voting poll for any decision makings", true)
        .setFooter('Bot Made By: RabilA#2691')
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(commandsEmbed)
    }
})



Client.login(process.env.BOT_TOKEN)
