import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'uploads/');
  },

  filename(req, file, callback) {
    const extension = path.extname(file.originalname);

    callback(null, `${file.filename}-${Date.now()}${extension}`);
  },
});

function checkFileType(file, callback) {
  const filetypes = /jpg|jpeg|png/;
  const extension = filetypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extension && mimetype) {
    return callback(null, true);
  } else {
    callback('Image Only');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, callback) {
    checkFileType(file, callback);
  },
});

router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default router;
