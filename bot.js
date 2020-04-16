import express from 'express';
const bot = express();
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import mongoose from 'mongoose';

mongoose.connect("mongodb://localhost/genio", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(data=>console.log('connection to Genio DB succeeded!!!'))
.catch(err=>console.log(err))

bot.use(express.json());
const writeFile = fs.createWriteStream(path.join(__dirname, "/server.log"), {
  flags: "a",
  encoding: "utf8",
});

const format = ":method\t:url\t:status\t:response-time";

bot.use(
  morgan(format, {
    stream: {
      write(message) {
        const finalIndex = message.length - 1;
        const lastTabIndex = message.lastIndexOf("\t");
        const str = message.substring(lastTabIndex + 1, finalIndex);
        let time = Math.ceil(parseFloat(str));
        if (time < 10) {
          time = `0${time.toString()}`;
        } else {
          time = time.toString();
        }
        const msg = `${message.substring(0, lastTabIndex + 1)}${time}ms\n`;
        writeFile.write(msg);
      },
    },
  })
);

bot.get('/', (req, res)=> {
    res.status(200).json({
        message:'I am Geniobot add me on +2348121694384'
    })
})

bot.post('/', async(req, res)=> {
    try {
        let data = req.body;
        console.log(data);
        let searchKeywords = ['hi' , 'hello', 'hii', 'hy' , 'hey', 'hello', 'xup', 'yo', 'yoh'];
        let greetings = ['Hello', 'My Buddy', 'Hey', 'Wonderful', 'The great', 'My Person', 'Hi', 'Hii'];
        let closeGreetings = ['Wetin dey?', 'How far?', 'Xup?', 'How are you doing?'];
        let random = Math.floor(Math.random() * greetings.length);
        let closeRandom = Math.floor(Math.random() * closeGreetings.length);
        let starter = data.messages[0].body.toLowerCase().split(' ');
        if (
          (data.messages[0].body.length > 0 &&
            searchKeywords.includes(starter[0]))
        ) {
          axios.post(
            `http://localhost:8000/83430/sendMessage?token=${process.env.token}`,
            {
              phone: `${parseInt(data.messages[0].author)}`,
              body: `
            ${greetings[random]} *${data.messages[0].chatName}* 
            \n${closeGreetings[closeRandom]} 
            \n*I am Genio*, and these are the things for you:
            \n*1. Genio-Status* \nUsage: You send Genio-Status \nWith this I can help you upload your content to my status, and keep a Record of your shared status. 
            \n*2. Genio-Covid19* \nSend you information about Coronavirus\nSend me: Genio-Covid <CountryName> to get Covid-Data about the country
            \n*3. Genio-Util* \nSend me this to send you procedure for getting your payment for utilities all sorted here on whatsapp.
            \n*4. Genio-Group* - Share your messages to groups.\nAdd me to two groups and I can help you share messages from one group to the other you don't need a telegram version of your group again.
            \nYou can send the text or the number to enter the mode of operation you want.
            \n\n🕵️‍♀️ *I am Genio*, and I am here to serve you.\n`,
            }
          );
        }

        // if (data.messages[0].body &&  data.messages[0].body.toLowercase().search('genio-covid19')>-1) {

        // }
        
        res.end();
    }catch(err) {
        console.log(err);
        res.end();
    }
})

process.env.NODE_ENV === "development"
  ? bot.listen(4000, () =>
      console.log(`Geniobot working on port ${4000}`)
    )
  : bot.listen(process.env.PORT, process.env.IP, () =>
      console.log(`Geniobot working on port ${process.env.PORT}`)
    );