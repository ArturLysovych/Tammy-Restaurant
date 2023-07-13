const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const PORT = 3000;
const TOKEN = '6316788534:AAFhhb1imuxXdfEhhi977LOMd8yaQwsq0qk';
const bot = new TelegramBot(TOKEN, { polling: true });

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/send-email', (req, res) => {
  const { message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.TOKEN 
    }
  });

  const mailOptions = {
    from: process.env.EMAIL, 
    to: 'arturlysovych2@gmail.com',
    subject: 'Tammy food 🍕',
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      res.status(500).send('Помилка під час відправлення повідомлення');
    } else {
      console.log(info);
      console.log('Повідомлення відправлено: ' + info.response);
      res.status(200).send('Повідомлення відправлено');
    }
  });
  bot.sendMessage(1442775189, message);
});

app.post('/say-hi', (req, res) => {  
	const transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
		user: process.env.EMAIL,
		pass: process.env.TOKEN 
	  }
	});
  
	const mailOptions = {
	  from: process.env.EMAIL, 
	  to: req.headers.client,
	  subject: 'Tammy food 🍕',
	  text: `🍕 Hello! Welcome to Tammy Food Pizzeria, where taste meets perfection. We are passionate about crafting delicious pizzas that will tantalize your taste buds. Whether you're a fan of classic Margherita or crave adventurous toppings, we have something to satisfy every pizza lover. Our skilled chefs use only the finest ingredients to create mouthwatering combinations that will leave you wanting more. Join us and experience the ultimate pizza indulgence at Tammy Food Pizzeria! 🍕`
	};
  
	transporter.sendMail(mailOptions, function(error, info) {
	  if (error) {
		console.log(error);
		res.status(500).send('Помилка під час відправлення повідомлення');
	  } else {
		console.log(info);
		console.log('Повідомлення відправлено: ' + info.response);
		res.status(200).send('Повідомлення відправлено');
	  }
	});
});

app.listen(PORT, () => {
  console.log(`Server work on PORT: ${PORT}`);
});