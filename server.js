const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(express.json());


const users = [];


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

    res.status(201).json({
      message: 'Signup Successful'
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server Error'
    });
  }

});


app.listen(3000, () => {
  console.log('Server Running on Port 3000');
});