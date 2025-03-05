import multer from "multer";
import path from "path";
import fs from "fs";


const uploadDir = path.join(process.cwd(), "/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads directory created.");
}

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    let uniquePrefix = Date.now();
    const fileName = uniquePrefix + "-" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

export default upload;
