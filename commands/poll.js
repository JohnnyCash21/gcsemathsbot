const Discord = require("discord.js");

module.exports.run = async (Client, message, args) => {

    if(!message.guild.me.permissions.has("EMBED_LINKS")  || !message.guild.me.permissions.has("ADD_REACTIONS")){
        message.channel.send("I do not have permissions to send embedded messages and/or add reactions to messages. Please enable the `EMBED_LINKS` and `ADD_REACTIONS` options on me.");
        return;
    }
    const pollEmbed = new Discord.MessageEmbed()
    .setColor("#d1900f")
    .setTitle("Democracy Voting Poll")
    .setDescription("Use `?poll (question)` to create a simple poll");

    if(!args[1]){
        message.channel.send(pollEmbed);
        return;
    }

    let msgArgs = args.slice(0).join(" ");
    pollEmbed.setDescription("📋 " + "**" + msgArgs + "**")
    pollEmbed.setFooter(`Poll created by ${message.author.tag}`)

    message.channel.send(pollEmbed).then(messageReaction => {
        messageReaction.react("👍");
        messageReaction.react("👎");
        message.delete({ timeout: 2000 }).catch(console.error)
    })

    return;


}

module.exports.help = {
    name: "poll",
    aliases: []
}
