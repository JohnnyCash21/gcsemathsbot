const ms = require('ms');
const Discord = require("discord.js");

module.exports.run = async (Client, message, args) => {

    let mainRole = message.guild.roles.cache.find(role => role.name === 'Revising');
    let memberTarget = message.guild.members.cache.get(message.author.id);

    if(!args[0]){
        return message.channel.send("Please specify a time, otherwise you will be revising for an infinite amount of time. E.g. `!revise 2h` to revise for 2 hours");
    }

    memberTarget.roles.add(mainRole.id);
    message.channel.send("Success, go revise now.");

    setTimeout(function () {
        memberTarget.roles.remove(mainRole.id);
    }, ms(args[0]));


}

module.exports.help = {
    name: "revise",
    aliases: []
}
