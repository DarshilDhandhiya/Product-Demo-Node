const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Store product data in memory
let products = [];

// Display the list of products
app.get('/', (req, res) => {
  res.render('index', { products });
});

// Render the form to add a new product
app.get('/add', (req, res) => {
  res.render('addProduct');
});

// Handle the form submission to add a new product
app.post('/add', upload.single('image'), (req, res) => {
  const { name, price } = req.body;
  const image = req.file.filename;
  const product = { name, price, image };
  products.push(product);
  res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});