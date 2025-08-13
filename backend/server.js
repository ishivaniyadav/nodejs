const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-'  + file.originalname),
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  const fileType = path.extname(req.file.originalname).toLowerCase();

  let type;
  if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileType)) type = 'Image';
  else if (fileType === '.pdf') type = 'PDF';
  else if (['.doc', '.docx'].includes(fileType)) type = 'Word Document';
  else type = 'Unknown';

  res.json({
    fileName: req.file.filename,
    originalName: req.file.originalname,
    type,
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
