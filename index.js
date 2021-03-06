const Discord = require("discord.js-selfbot");
const config = require('./config.json');

const webhookClient = new Discord.WebhookClient(config.webhook.id, config.webhook.token);

config.tokens.forEach(token => {
  const client = new Discord.Client();

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const channel = client.channels.cache.get(config.channel);
    setInterval(function() {
      if(config.time.wait.enabled == true){
        var d = new Date();
        var n = d.getHours();
        if (n < config.time.wait.starttime && n > config.time.wait.endtime ) {
          channel.send("kd");
        }
      }else{
          channel.send("kd");
        }
    }, config.time.drop.delay + Math.floor(Math.random() * config.time.drop.random));
  });

  client.on('message', (message) => {
    if (message.author.bot) {
      if (message.content.includes(`<@${client.user.id}> took the`) || message.content.includes(`<@${client.user.id}> fought off`)) {
        if (message.channel == config.channel) {
          if(config.webhook.enabled == true){
            webhookClient.send(message.content);
          }
          console.log(`${client.user.tag} took the card`);
        }
      }
      if (message.content.includes(`<@${client.user.id}> is dropping`)) {
        console.log(client.user.tag + " is dropping cards")
        const filter = (reaction, user) => {
          return ["1️⃣", "2️⃣", "3️⃣", "4️⃣"].includes(reaction.emoji.name)
        };
        const collector = message.createReactionCollector(filter);
        collector.on('collect', (reaction, user) => {
          if (reaction.count > config.reactions) {
            console.log(`${config.reactions} reactions were recorded`)
            message.react(reaction._emoji.name);
            collector.stop();
            console.log("Disabling collector")
          }
        });
        setTimeout(() => {
          collector.stop();
          console.log("Disabling collector beacuse noone reacted")
        }, config.collector)
      }
    }
  });
  client.login(token);
})
