const express = require('express');
const { add, get, getUsername } = require('../data/user');
const { createJSONToken, isValidPassword } = require('../util/auth');
const { isValidEmail, isValidText, validatePhoneNumber } = require('../util/validation');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  const data = req.body;
  let errors = {};

  if (!data.username) {
    errors.username = 'Invalid username.';
  }else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email.';
  }else if (!validatePhoneNumber(data.phone)) {
    errors.phone = 'Invalid phone number.';
  } else {
    try {
      const existingUserEmail = await get(data.email);

      if (existingUserEmail) {
        errors.email = 'Email exists already.';
      }
    } catch (error) { }

    try {
      const existingUsername = await getUsername(data.username);

      if (existingUsername) {
        errors.username = 'Username exists already.';
      }
    } catch (error) { }
  }

  if (!isValidText(data.password, 6)) {
    errors.password = 'Invalid password. Must be at least 6 characters long.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'User signup failed due to validation errors.',
      errors,
    });
  }

  try {
    const createdUser = await add(data);
    // const authToken = createJSONToken(createdUser.email);
    res
      .status(201)
      .json({ message: 'User created.', user: createdUser });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user;
  try {
    user = await get(email);
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed.' });
  }

  const pwIsValid = await isValidPassword(password, user.password);
  if (!pwIsValid) {
    return res.status(422).json({
      message: 'Invalid credentials.',
      errors: { credentials: 'Invalid email or password entered.' },
    });
  }

  const token = createJSONToken(email);
  res.json({
    username: user.username, 
    email: user.email,
    phone: user.email,
    id: user.id,
    token 
  });
});

module.exports = router;
