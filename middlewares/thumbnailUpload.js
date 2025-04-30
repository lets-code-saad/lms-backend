const multer = require("multer");

// for thumbnail
const thumbnailStorage = multer.memoryStorage();

const upload = multer({ storage:thumbnailStorage });

// for video
const videoStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, "Videos"); // stores files in this folder
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})

const videoUpload = multer({ storage:videoStorage }); // it should be storage

module.exports = {upload, videoUpload};
