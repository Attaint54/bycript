require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

const SECRET_KEY = process.env.SECRET_KEY;



app.get('/', (req, res) => {
  res.send('Backend Working');
});



app.post('/signup', async (req, res) => {

  try {

    const { name, email, password } = req.body;

    
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {

      return res.status(400).json({
        message: 'Email already exists'
      });

    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword
    };

    
    users.push(newUser);

    console.log(users);

    
    const token = jwt.sign(

      {
        id: newUser.id,
        email: newUser.email
      },

      SECRET_KEY,

      {
        expiresIn: '1h'
      }

    );

    res.status(201).json({
      message: 'Signup Successful',
      token
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server Error'
    });

  }

});



app.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    
    const user = users.find(user => user.email === email);

    if (!user) {

      return res.status(400).json({
        message: 'User Not Found'
      });

    }

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return res.status(400).json({
        message: 'Invalid Password'
      });

    }

    
    const token = jwt.sign(

      {
        id: user.id,
        email: user.email
      },

      SECRET_KEY,

      {
        expiresIn: '1h'
      }

    );

    res.json({
      message: 'Login Successful',
      token
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server Error'
    });

  }

});



app.get('/dashboard', (req, res) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({
        message: 'Token Missing'
      });

    }

    const token = authHeader.split(' ')[1];

   
    const decoded = jwt.verify(token, SECRET_KEY);

    res.json({
      message: `Welcome ${decoded.email}`,
      user: decoded
    });

  } catch (error) {

    console.log(error);

    res.status(401).json({
      message: 'Invalid Token'
    });

  }

});



app.listen(3000, () => {
  console.log('Server Running On Port 3000');
});