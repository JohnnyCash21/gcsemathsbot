const Discord = require("discord.js");
const Youtube_API = process.env.YOUTUBE_API;
const fetch = require('node-superfetch');

module.exports.run = async (Client, message, args) => {

    try{
        const channel =  await fetch.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=TheGCSEMathsTutor&key=${Youtube_API}&maxResults=1&type=channel`)

        const data =  await fetch.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics,brandingSettings&id=${channel.body.items[0].id.channelId}&key=${Youtube_API}`)
        console.log(channel.body.items[0].id.channelId);
    
        const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle('Youtube Stats')
        .setThumbnail(channel.body.items[0].snippet.thumbnails.high.url)
        .setTimestamp(new Date())
        .addField("Channel Name", channel.body.items[0].snippet.channelTitle, true)
        .addField("Channel Description", channel.body.items[0].snippet.description, true)
        .addField("Subscribers Count", parseInt(data.body.items[0].statistics.subscriberCount).toLocaleString(), true)
        .addField("Total Views", parseInt(data.body.items[0].statistics.viewCount).toLocaleString(), true)
        .addField("Total Video(s)", parseInt(data.body.items[0].statistics.videoCount).toLocaleString(), true)
        .addField("Date Created", new Date(channel.body.items[0].snippet.publishedAt).toDateString(), true)
        .addField("Link", `[${channel.body.items[0].snippet.channelTitle}](https://www.youtube.com/channel/${channel.body.items[0].id.channelId})`, true)
        .addField("Country", data.body.items[0].snippet.country ? `${data.body.items[0].snippet.country}`  : "No Country Provided", true)
        
         message.channel.send(embed);
    
    } catch(err) {
        const channel =  await fetch.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=TheGCSEMathsTutor&key=${Youtube_API}&maxResults=1&type=channel`)
        message.channel.send('Unknown channel data error')
        console.log(err)
        if (!channel.body.items[0]) return message.channel.send("No channel result. Try again.");
    }

}

module.exports.help = {
    name: "ytstats",
    aliases: ["stats", "yt"]
}
