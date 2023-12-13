const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';
const cors = require('cors');
const fs = require('fs');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const path = require('path');
const uuid = require('uuid');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
 app.use(function(req, res, next) {  
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
 });  
 
const corsOptions = {
    origin: true, //included origin as true
    credentials: true, //included credentials as true
};

app.use(cors(corsOptions));
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
const directory = "C:\Users\Bitcom Tech\Desktop\New folder (8)\Zay.Shop\templatemo_559_zay_shop";
app.use(express.static(__dirname));

app.get('/', (req, res) => {
   // Get the absolute path of the directory containing the current script
  const directory = path.dirname(__filename);

  // Send the index.html file using sendFile
  res.sendFile(path.join(directory, 'index.html'));

});

//verify token
function verifyToken(req, res, next) {
  // Implement your logic to verify the token here (decode and verify the token)
  // For example, you can decode the token from the cookie in the request headers
  console.log("verify");
   if (!req.cookies) {
    return res.status(401).json({ error: 'Request or cookies not found' });
  }

  const token = req.cookies.jwts; // Assuming the token is sent in a cookie
  console.log(token);
  console.log("yers");
  // Verify and decode the token (you need to provide your own secretKey)
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({message: 'unauthorized' });
    }
    req.decoded = decoded; // Attach decoded token data to the request object
    next();
  });
}






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
        console.log("here");
        const payload = { username: email };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        console.log(token);
        res.cookie('jwts', token, {
        maxAge: 3600000,
         
          sameSite: 'strict' 
      
        });
         
         res.status(200).json({ success: true, message: 'Login successful!', token: token });
        
      } else {
        // User not found or wrong credentials
         res.status(401).json({ success: false, message: 'Invalid credentials' });
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

    res.status(200).json({ success: true, message: 'sign up successful!' });
  }

});

});
app.get('/database_cart',verifyToken, (req, res) => {
    db.query('SELECT cart FROM session_cart WHERE username = ?', [req.decoded.username], (error, results) => {
    if (error) {
      // Handle database error
      console.error('Database error:', error);
      res.status(500).json({ message: 'Database error' });
    } else {
      // Handle successful database query
      console.log(results.length);
      if (results.length === 0) {
        console.log("inside");
        return res.status(500).json({message:'no result from database'});
      }
      console.log(results[0].cart);
      cart = results[0].cart;
      console.log(cart);
      res.status(200).json({ cart }); // Sending cart data as a response
    }
  });
   
});
app.post('/logout',verifyToken, (req, res) => {
   res.cookie('jwts', '', { maxAge: 1 });

   const cart_user = req.body;
   const json_cart = JSON.stringify(cart_user);

   const username = req.decoded.username;
   console.log(username);

   console.log(cart);

   const check_query = 'SELECT * FROM session_cart WHERE username = ?'
   db.query(check_query,[username],(checkError,checkResults)=>{
   
   if(checkError){
    res.status(500).json({message:'check Database error'});

   }else{
       if (checkResults.length > 0) {
         const updateQuery = 'UPDATE session_cart SET cart = ? WHERE username = ?';
         db.query(updateQuery,[json_cart,username],(updateError)=>{
          if (updateError) {
            res.status(500).json({message:'update database error'});
          }
          else{
            res.status(200).json({message:'database updated'});

          }

         }


       );
       }
       else{
        const cart_query = 'INSERT INTO session_cart (username,cart) VALUES (?,?)'
        db.query(cart_query,[username,json_cart],(error,results,fields)=>{
          if (error) {
              console.error('Error inserting cart'+ error);
          } else{
                console.log("cart inserted successfully");
                console.log(cart);
                
                res.status(200).json({success:true,message:'inserted successfully'});
          }

         });

        }

          }

   })

  
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/user_jwt', (req, res) => {
  const id = uuid.v4();
  const payload = { username: id , cart: cart };
  const token = jwt.sign(payload, secretKey, { expiresIn: '100h' });
  console.log("user jwt");
  res.cookie('unlogged', token, {
         // Ensures the cookie is only accessible via HTTP(S) and not client-side JavaScript
        maxAge: 3600000, // Cookie expiration time in milliseconds (e.g., 1 hour)
         // Cookie will only be sent over HTTPS if set to true
          sameSite: 'strict' // Controls the cookie's cross-site usage
      // You can add other cookie options as needed
        });

  res.status(200).json({ success: true, message: 'Login successful!', token: token });
        

});