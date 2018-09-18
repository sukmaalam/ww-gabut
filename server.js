var express = require('express');
var bodyParser = require('body-parser');
var line = require('@line/bot-sdk');
var myconfig = require('./config.js');
var Promise = require('bluebird');
var dialogManager = require('./dialogManager.js')

var app = express();

var config = {
    channelAccessToken: myconfig.VB7VpIYeKKER+/Hq+T+o0KVTK74fgvriCb2GTAdw/Q48KJPpVkJCjsXGV++bewIpuvWLdFIrP8Wgkc3ht1J8cqOhopBfyVE+gSfjIqPpZiGK5zTf7XvHrEWTAzTfsPlXRbidJS5h/gAiQIU/BTvhoAdB04t89/1O/w1cDnyilFU=,
    channelSecret: myconfig.a68ce80c4f175368b5f7c744f2e2f31c

}
const client = new line.Client(config);
dialogManager.setClient(client);

console.dir("manager from root", dialogManager);
app.use(line.middleware(config));
app.use(bodyParser.json());

app.post('/webhook', function(req, res){
  console.log(req.body);
  Promise
    .all(req.body.events.map(dialogManager.decideAction))
    .then(function(result){
        return res.json(result);
    });
});


function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

app.listen(3000, function(){
  console.log("server running on port 3000");
});
