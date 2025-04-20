import multer from "multer";
import path from "path";
import fs from "fs";

// create the uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads directory created.");
}

// configure multer storage to specify destination and filename
const storage = multer.diskStorage({
  // set the destination for uploaded files
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  // set the filename for uploaded files with a unique prefix
  filename: function (req, file, cb) {
    let uniquePrefix = Date.now();
    const fileName = uniquePrefix + "-" + file.originalname;
    cb(null, fileName);
  },
});

// initialize multer with the configured storage
const upload = multer({ storage: storage });

export default upload;
