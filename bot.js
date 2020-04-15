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
        let searchKeywords = ['Hi' , 'Hello', 'Hii', 'Hy' , 'Hey', 'Hello', 'Xup', 'Yo', 'Yoh'];
        let greetings = ['Hello', 'My Buddy', 'Hey', 'Wonderful', 'The great', 'My Person', 'Hi', 'Hii'];
        let closeGreetings = ['Wetin dey?', 'How far?', 'Xup?', 'How are you doing?'];
        let random = Math.floor(Math.random() * greetings.length);
        let closeRandom = Math.floor(Math.random() * closeGreetings.length);
        if (data.messages && data.messages[0].body.length > 0) {
        axios.post(
          `http://localhost:8000/83430/sendMessage?token=${process.env.token}`,
          {
            phone: `${parseInt(data.messages[0].author)}`,
            body: `
            ${greetings[random]} ${data.messages[0].chatName} 
            \n${closeGreetings[closeRandom]} 

            These are the things for you:
            1. Genio-Status - you send 1 or Genio-Status 
            \t\tWith this I can help you upload your content to my status, and keep a
            \t\tRecord of your status shared via me. 

            2. Genio-Covid - Send you information about Coronavirus
            \t\tSend me: Genio-Covid <CountryName> to get Covid-Data about the country

            3. Genio-Util- Send me this to send you procedure for getting your payment
            \t\tfor utilities all sorted here on whatsapp.
            
            4. Genio-Group- Share your messages to groups for your
            \t\tAdd me to two groups and I can help you share messages from one group to the other
            \t\tyou don't need a telegram version of your group again.

            \n\n🕵️‍♀️*I am Genio, and I am glad to serve you.*\n`,
          }
        );
        }
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