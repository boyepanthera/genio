import express from 'express';
const bot = express();
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import mongoose from 'mongoose';
import Status from './models/Status';
import {Rounder} from './injections';
import countries from './countries';
let countryStr ='';
countries.forEach((country, i)=> countryStr+= `${i+1}. ${country}\n`);
var State = 0

const writeWebinar = fs.createWriteStream(
  path.join(__dirname, "/webinar.txt"),
  {
    flags: "a",
    encoding: "utf8",
  }
);

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
          let searchKeywords = [
            "hi",
            "hai",
            "hello",
            "hii",
            "hy",
            "hey",
            "heyy",
            "hayi",
            "hayy",
            "ay",
            "hello",
            "xup",
            "yo",
            "yoh",
          ];
          let greetings = [
            "Hello",
            "My Buddy",
            "Hey",
            "Wonderful",
            "The great",
            "My Person",
            "Hi",
            "Hii",
            "Heyy",
          ];
          let closeGreetings = [
            "Wetin dey?",
            "How far?",
            "Xup?",
            "How are you doing?",
          ];
          let random = Math.floor(Math.random() * greetings.length);
          let closeRandom = Math.floor(Math.random() * closeGreetings.length);
          let starter;
          if (data.messages) {
            starter = data.messages[0].body.toLowerCase().split(" ");
          }

          // For sending base message
          if (
            data.messages &&
            data.messages[0].author.length < 19 &&
            data.messages[0].body &&
            data.messages[0].body.length > 0 &&
            (searchKeywords.includes(starter[0]) ||
              parseInt(data.messages[0].body) === 0)
          ) {
            axios
              .post(
                `http://localhost:8000/83430/sendMessage?token=${process.env.token}`,
                {
                  phone: `${parseInt(data.messages[0].author)}`,
                  body: `
            ${greetings[random]} *${data.messages[0].chatName}* 
            \n${closeGreetings[closeRandom]} 
            \n*I am Genio*, and these are the things for you:
            \n*1. Genio-Status* \nUsage: You send Genio-Status \nWith this I can help you upload your content to my status, and keep a Record of your shared status. 
            \n*2. Genio-Covid* \nSend you information about Coronavirus\nSend me: Genio-Covid <CountryName> to get Covid-Data about the country
            \n*3. Genio-Share* - Share your messages to groups.\nAdd me to two groups and I can help you share messages from one group to the other you don't need a telegram version of your group again.
            \nYou can send the text or the number to enter the mode of operation you want.
            \n\n🕵️‍♀️ *I am Genio*, and I am here to serve you.🏋️‍♀️\n`,
                }
              )
              .then((update) => (State = 0));
          }
          let modeKeywords = [
            "genio-status",
            "genio-util",
            "genio-covid",
            "genio-share",
          ];
          let modeCheck;
          if (data.messages) {
            modeCheck = data.messages[0].body.toLowerCase().split(" ");
          }

          let statusBodyCheck;
          if (data.messages) {
            statusBodyCheck = data.messages[0].body.split(" ");
          }

          let statusSecondBodyCheck;
          if (data.messages) {
            statusSecondBodyCheck = data.messages[0].body.split("\n");
          }

          // Response for Genio Status Mode
          if (
            data.messages &&
            data.messages[0].body &&
            data.messages[0].body.length > 0 &&
            (modeCheck[0] === "genio-status" || parseInt(modeCheck[0]) === 1)
          ) {
            axios
              .post(
                `http://localhost:8000/83430/sendMessage?token=${process.env.token}`,
                {
                  phone: `${parseInt(data.messages[0].author)}`,
                  body: `
              Yes, *${data.messages[0].chatName}*, Genio here, I am ready to execute your Status update task.
              \nSend me your content in the following format:
              \n\n11 or Genius-Status-Body *NB:Not case sensitive*
              \nYour content...
              \n\nYour Name  *NB:This is optional*
              `,
                }
              )
              .then((updated) => {
                State = 1;
                console.log(updated.data);
              })
              .catch((err) => console.log(err.message));
          }

          // Response for After Getting and Uploading status content
          if (
            data.messages &&
            data.messages[0].body &&
            data.messages[0].body.length > 0 &&
            State === 1 &&
            (statusBodyCheck[0].toLowerCase() === "genio-status-body" ||
              statusBodyCheck[0].substring(0, 17).toLowerCase() ===
                "genio-status-body" ||
              parseInt(statusBodyCheck[0]) === 11)
          ) {
            // console.log(data.messages[0].body);
            console.log(statusBodyCheck);
            if (
              statusBodyCheck[0].toLowerCase() !== "genio-status-body" &&
              State === 1 &&
              statusBodyCheck[0].length > 2 &&
              statusBodyCheck[0].substring(0, 17).toLowerCase() !==
                "genio-status-body"
            ) {
              // statusBodyCheck[0] = statusBodyCheck[0].replace('\n', ' ');
              let shadowBody = statusBodyCheck[0].replace("\n", " ").split(" ");
              statusBodyCheck[0] = shadowBody[1];
              statusBodyCheck.unshift(shadowBody[0]);
              console.log(data.messages[0].author);
              // console.log(statusBodyCheck)
              axios
                .post(
                  `http://localhost:8000/83430/uploadStatus?token=${process.env.token}`,
                  {
                    body: statusBodyCheck
                      .slice(1)
                      .toString()
                      .replace(/,/g, " "),
                  }
                )
                .then(async (upload) => {
                  const status = await new Status({
                    chatName: parseInt(data.messages[0].author),
                    body: statusBodyCheck
                      .slice(1)
                      .toString()
                      .replace(/,/g, " "),
                  });
                  status.save();
                  console.log("upload success" + upload.data);
                  axios.post(
                    `http://localhost:8000/83430/sendMessage?token=${process.env.token}`,
                    {
                      phone: `${parseInt(data.messages[0].author)}`,
                      body: `
              Done! *${data.messages[0].chatName}* you can check my status to view your update.
              \n *send 0 to get list of task I can run*.
              \n\n🕵️‍♀️ *I am Genio*, and I am always here to serve you.🏋️‍♀️ 
              `,
                    }
                  );
                })
                .catch((err) => console.log(err.message));
            } else if (
              statusBodyCheck[0].toLowerCase() !== "genio-status-body" &&
              State === 1 &&
              statusBodyCheck[0].substring(0, 17).toLowerCase() ===
                "genio-status-body"
            ) {
              console.log(data.messages[0].author);
              statusBodyCheck[0] = statusBodyCheck[0].substring(17);
              statusBodyCheck.unshift(statusBodyCheck[0].substring(0, 17));
              console.log(statusBodyCheck);
              axios
                .post(
                  `http://localhost:8000/83430/uploadStatus?token=${process.env.token}`,
                  {
                    body: statusBodyCheck
                      .slice(1)
                      .toString()
                      .replace(/,/g, " "),
                  }
                )
                .then(async (upload) => {
                  console.log("upload success" + upload.data);
                  const status = await new Status({
                    chatName: parseInt(data.messages[0].author),
                    body: statusBodyCheck
                      .slice(1)
                      .toString()
                      .replace(/,/g, " "),
                  });
                  status.save();
                  axios.post(
                    `http://localhost:8000/83430/sendMessage?token=${process.env.token}`,
                    {
                      phone: `${parseInt(data.messages[0].author)}`,
                      body: `
              Done! *${data.messages[0].chatName}* you can check my status to view your update.
              \n send 0 to get list of task I can run.
              \n\n🕵️‍♀️ *I am Genio*, and I am always here to serve you.🏋️‍♀️ 
              `,
                    }
                  );
                })
                .catch((err) => console.log(err.message));
            } else if (State === 1) {
              console.log(data.messages[0].author);
              statusBodyCheck[1] = statusBodyCheck[1].replace("\n", "");
              axios
                .post(
                  `http://localhost:8000/83430/uploadStatus?token=${process.env.token}`,
                  {
                    body: statusBodyCheck
                      .slice(1)
                      .toString()
                      .replace(/,/g, " "),
                  }
                )
                .then(async (upload) => {
                  const status = await new Status({
                    chatName: parseInt(data.messages[0].author),
                    body: statusBodyCheck
                      .slice(1)
                      .toString()
                      .replace(/,/g, " "),
                  });
                  status.save();
                  console.log("upload success" + upload.data);
                  axios.post(
                    `http://localhost:8000/83430/sendMessage?token=${process.env.token}`,
                    {
                      phone: `${parseInt(data.messages[0].author)}`,
                      body: `
              Done! *${data.messages[0].chatName}* you can check my status to view your update.
              \n send 0 to get list of task I can run.
              \n\n🕵️‍♀️ *I am Genio*, and I am always here to serve you.🏋️‍♀️ 
              `,
                    }
                  );
                })
                .catch((err) => console.log(err.message));
            }
          }

          // For Generating Covid-19 Data
          if (
            data.messages &&
            data.messages[0].body &&
            data.messages[0].body.length > 0 &&
            data.messages[0].author.length < 19 &&
            State !== 2 &&
            (parseInt(data.messages[0].body) === 2 ||
              data.messages[0].toString().toLowerCase() === "genio-covid")
          ) {
            axios
              .post(
                `http://localhost:8000/83430/sendMessage?token=${process.env.token}`,
                {
                  phone: `${parseInt(data.messages[0].author)}`,
                  body: `
              Yes, *${data.messages[0].chatName}*, Genio here, I am ready to Fetch you Covid-19 report of any country.
              \n${countryStr}
              \n\n🕵️‍♀️ *I am Genio*, and I am always here to serve you.🏋️‍♀️
              `,
                }
              )
              .then((updated) => {
                State = 2;
              })
              .catch((err) => console.log(err.message));
          }

          // let bodyBreak;
          // if(data.messages){
          //   bodyBreak = data.messages[0].split(' ')
          // }
          // For Fetching Covid-19 Data and Sending to query guy
          if (
            data.messages &&
            data.messages[0].body &&
            data.messages[0].body.length > 0 &&
            State === 2 &&
            parseInt(data.messages[0].body) > 0
          ) {
            axios
              .get(
                `https://corona.lmao.ninja/v2/countries/${
                  countries[parseInt(data.messages[0].body) - 1]
                }`
              )
              .then((response) => {
                let sentMessage = response.data;
                axios.post(
                  `http://localhost:8000/83430/sendMessage?token=${process.env.token}`,
                  {
                    phone: `${parseInt(data.messages[0].author)}`,
                    body: `
                        Yes, *${data.messages[0].chatName}*, Here is your data.
                        \n*Here is the latest COVID-19 report for ${
                          sentMessage.country
                        }:*
                        \nCases Today: ${sentMessage.todayCases}
                        \nTotal Cases : ${sentMessage.cases}
                        \nTotal Recovered : ${sentMessage.recovered}
                        \nRecovery Rate: ${Rounder(
                          (sentMessage.recovered * 100) / sentMessage.cases,
                          2
                        )}%
                        \nActive : ${sentMessage.active}
                        \nTotal Deaths : ${sentMessage.deaths}
                        \nCritical : ${sentMessage.critical}
                        \nPlease stay home & stay safe. 
                        \n*Huge 💝 from Genio*.
                        \n🕵️‍♀️ *I am Genio*, and I am always here to serve you.🏋️‍♀️
                        \n\n_Send 0 to get list of tasks I can do for you_.
              `,
                  }
                );
              })
              .catch((err) => console.log(err.message));
          }

          // Response for Group share mode (3)
          if (
            data.messages &&
            data.messages[0].body &&
            data.messages[0].author.length < 19 &&
            data.messages[0].body.length > 0 &&
            State !== 3 &&
            parseInt(data.messages[0].body) === 3
          ) {
            axios
              .post(
                `http://localhost:8000/83430/sendMessage?token=${process.env.token}`,
                {
                  phone: `${parseInt(data.messages[0].author)}`,
                  body: `
                    Yes, *${data.messages[0].chatName}*, Genio here, I am ready to help you share contents across whatsapp groups.
                    \nYou don't need to move your groups to Telegram again.
                    \nAdd me to the two whatsapp groups
                    \n\n🕵️‍♀️ *I am Genio*, and I am always here to serve you.🏋️‍♀️`,
                }
              )
              .then((updated) => {
                State = 3;
              })
              .catch((err) => console.log(err.message));
          }

          // Response for Group share mode (3)
          if (
            data.messages &&
            data.messages[0].body &&
            data.messages[0].author.length > 19 &&
            data.messages[0].body.length > 0 &&
            State !== 3 &&
            parseInt(data.messages[0].body) === 3
          ) {
            axios.post(
              `http://localhost:8000/83430/sendMessage?token=${process.env.token}`,
              {
                chatId: `${data.messages[0].author}`,
                body: `
                    Yes, *${data.messages[0].chatName}*, Genio here, I am ready to help you share contents across whatsapp groups.
                    \nYou don't need to move your groups to Telegram again.
                    \n\n🕵️‍♀️ *I am Genio*, and I am always here to serve you.🏋️‍♀️`,
              }
            ).then(sendGroup => {
              State =3
            })
          }

          var pdfString = ['Hey I a dummy'];

          if (
            data.messages &&
            data.messages[0].body &&
            data.messages[0].author.length > 19 &&
            data.messages[0].body.length > 0 &&
            State === 3 
          ) {
            if (parseInt(data.messages[0].body) !==4) {
              writeWebinar.write(data.messages[0].body);
            }
          
          if (
            data.messages &&
            data.messages[0].body &&
            data.messages[0].author.length > 19 &&
            data.messages[0].body.length > 0 &&
            State === 3 &&
            parseInt(data.messages[0].body) === 4
          ) {
            console.log(fs.createReadStream(__dirname + '/webinar.txt'))
            axios.post(
              `http://localhost:8000/83430/sendMessage?token=${process.env.token}`,
              {
                chatId: `${data.messages[0].author}`,
                body: pdfString[0],
              }
            );
          }
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