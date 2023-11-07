const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';
const cors = require('cors');
const fs = require('fs');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;



app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root@yonas@password',
  database: 'myappdb',
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});


app.use(cors());
app.use(express.json());

let cart = [];
// Add an item to the cart
app.post('/cart/add', (req, res) => {
  const item = req.body;
  cart.push(item);
  res.json({ message: 'Item added to cart', cart });
});
app.use(express.static('public'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));
app.post('/submit', (req, res) => {
  const formData = req.body;
  const user_info_json = JSON.stringify(formData);
  const cart_json = JSON.stringify(cart);
  
  fs.writeFile('data.json', JSON.stringify(formData, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error saving data.');
    }
    console.log('Form data to data.json');

    console.log(cart.price);
    console.log(req.session.userId);

    const query = 'INSERT INTO orders(id,product_info,user_info) values (?,?,?)'
    db.query(query, [[req.session.userId],[cart_json],[user_info_json]], (err, results,fields) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      if (results.length > 0) {
        // User found, respond with success
        res.json({ message: 'order successful'});

        console.log("order successful")
      } else {
        // User not found or wrong credentials
        res.status(401).json({ message: 'order failed' });
      }
    }
  });

    //res.redirect('/payment.html'); // Redirect to the payment page
  });
});

app.get('/', (req, res) => {
    res.send('Welcome to your server!'); // You can customize this response
     console.log(typeof cart);  
});
// Get the cart contents
app.get('/cart/add', (req, res) => {
  res.json(cart);

});

app.put('/cart/modify', (req, res) => {
  // Retrieve data from the request body
  const {itemId} = req.body;
  const itemIndex = cart.findIndex(item => item.id === itemId);
  cart.splice(itemIndex, 1);
  
  

  // Send a response to acknowledge the modification
  res.json({ message: 'Data modified successfully' });
});

app.post('/cart/login', (req, res) => {
  const { email, password } = req.body;

  // Check user credentials in the database
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      if (results.length > 0) {
        // User found, respond with success
        const payload = { username: email };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        res.cookie('token', token, { maxAge: 3600000, httpOnly: true});
        
         
        console.log("login successful")
      } else {
        // User not found or wrong credentials
        res.status(401).json({ message: 'Invalid email or password' });
      }
    }
  });
});

app.post('/cart/signup',(req,res)=>{
  const {name,email,password}=req.body;
  const insertUserQuery = 'INSERT INTO users (name, username, password) VALUES (?, ?, ?)'
  db.query(insertUserQuery, [name, email, password], (error, results, fields) => {
  if (error) {
    console.error('Error inserting user: ' + error);
  } else {
    console.log('User inserted successfully!');
  }

});

});
app.get('/protected-route', (req, res) => {
  if (req.session.userId) {
    // User is logged in, render the protected page
    res.render('protected-page');
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect('/login');
  }
});
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login'); // Redirect to the login page after logout
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});