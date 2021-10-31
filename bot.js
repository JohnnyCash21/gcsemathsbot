const Discord = require("discord.js");
const fetch = require('node-superfetch');
const prefix = "?";
const fs = require("fs");

const Client = new Discord.Client({ disableMentions: 'everyone' });

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
        message.channel.send("Yo");
    }
})



Client.login(process.env.BOT_TOKEN)
