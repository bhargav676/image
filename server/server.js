const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); 
const Images = require('./model');

app.use(cors());
app.use(express.json()); 

// Define the directory for storing uploaded images
const uploadDir = path.join(__dirname, 'uploads');

// Ensure the 'uploads' folder exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve images from the 'uploads' folder
app.use('/images', express.static(uploadDir));

app.listen(4000, () => {
    console.log("Server started on port 4000");
});

mongoose.connect("mongodb+srv://322103312083:951509290@cluster0.8iess.mongodb.net/movie")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("Error connecting to database:", err);
    });

// Define storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save images to the 'uploads' folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Endpoint to upload an image
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

// Endpoint to fetch images
app.get('/getimage', async (req, res) => {
    try {
        const data = await Images.find({});
        res.json({ status: "ok", data: data });
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ status: "error", message: "Error fetching images" });
    }
});
