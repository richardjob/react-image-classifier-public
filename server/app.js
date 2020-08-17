const express = require("express");
const app = express();
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");

// Middlewares
app.use(bodyParser.json());
app.use(
  cors({
    origin: true,
  })
);

const storage = new Storage({
  projectId: "storage-test-6e3fb",
  keyFilename:
    "./image-classifier-7dd07-firebase-adminsdk-14m57-5241b56ef1.json",
});

const bucket = storage.bucket("gs://image-classifier-7dd07.appspot.com");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024, // no larger than 8mb, you can change as needed.
  },
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log("Server Running");
});


app.post("/upload", multer.single("image"), (req, res) => {
  let email = req.body.email;
  let file = req.file;

  if (file) {
    bucket.deleteFiles({
      prefix: `${email}/`,
    });

    uploadImageToStorage(email, file)
      .then((url) => {
        res.status(200).send({
          status: "success",
          url: url,
        });
        console.log("Upload Success");
      })
      .catch((error) => {
        res.status(400).send({
          status: "failed",
        });
        console.log("Upload Failed");
      });
  }
});


const uploadImageToStorage = (email, file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }

    let ext = file.mimetype.split("/")[1];

    let newFileName = `${email}/image.${ext}`;

    let fileUpload = bucket.file(`${newFileName}`);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      reject(error);
    });

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      let fileName = fileUpload.name.replace(/\//g, "%2F").replace(/\@/, "%40");
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileName}?alt=media`;

      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};
