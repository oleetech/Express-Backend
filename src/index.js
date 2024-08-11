// src/index.js
// Express এবং body-parser প্যাকেজ ইম্পোর্ট করা
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

// Middleware সেটআপ
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// PORT সেটআপ
const port = process.env.PORT || 3000; // যদি env থেকে PORT না পাওয়া যায়, তবে 3000 ব্যবহার হবে

app.listen(port, () => {
    console.log("PORT:", port); // ব্যবহার করা PORT দেখাবে
    console.log("Application started"); // অ্যাপ্লিকেশন শুরু হওয়ার বার্তা
});
