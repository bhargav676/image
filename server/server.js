const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const Images = require('./model');

app.use(cors());
app.use(express.json()); // If you need to parse JSON bodies
app.use('/images', express.static(path.join(__dirname, '../client/src/images')));

app.listen(4000, () => {
    console.log("Server started on port 4000");
});

mongoose.connect('mongodb+srv://322103312083:951509290@cluster0.8iess.mongodb.net/movie')
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("Error connecting to database:", err);
    });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../client/src/images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/uploadimage', upload.single('image'), async (req, res) => {
    const imagename = req.file.filename;
    try {
        await Images.create({ image: imagename });
        res.json({ status: "ok" });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).send("Error uploading image");
    }
});

app.get('/getimage', async (req, res) => {
    try {
        const data = await Images.find({});
        res.json({ status: "ok", data: data });
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ status: "error", message: "Error fetching images" });
    }
});
