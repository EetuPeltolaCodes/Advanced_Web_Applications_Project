var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport')
const Users = require('../models/users');
const multer = require('multer');
const initializePassport = require('../middleware/passport-config')
const { check, body, validationResult } = require('express-validator');

// Multer setup
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Function to find users by username/email
function getUserByUsername(username) {
  return Users.findOne({ username: username }).exec();
}

// Function to find users by _id
function getUserById(id) {
  return Users.findOne({ _id: id }).exec();
}

// Middleware to check if the user is authenticated
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next()
  }

  return res.json({ 
    isAuthenticated: false,
   });
}

// Middleware to check if the user is not authenticated
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.json({ 
      isAuthenticated: true,
      id: req.user._id
     });
  }
  return next()
}

// Initialize Passport middleware
initializePassport(passport, getUserByUsername, getUserById);


router.get('/register', checkNotAuthenticated, (req, res, next) => {
  // If checkNotAuthenticated middleware passes, this means the user is not authenticated
  return res.json({ isAuthenticated: false });
});

// Register route
router.post('/register',
  check('password').isStrongPassword(), // Validate password strength
  body('email').escape(),
  body('password'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ message: "Password is not strong enough"});
      } if(!req.body.firstname) {
        return res.json({ message: "Firstname not given"});
      } if(!req.body.lastname) {
        return res.json({ message: "Lastname not given"});
      }

      const user = await Users.findOne({ username: req.body.email });

      if (user) {
        return res.json({ message: 'Email already in use' });
      }

      // Create a password for the user
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      const usersName = req.body.firstname + " " + req.body.lastname

      // Create the new user
      await Users.create({
        name: usersName,
        username: req.body.email,
        password: hash,
      });

      console.log({
        name: usersName,
        username: req.body.email
      })

      return res.json({success: "ok"});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

router.get('/login', checkNotAuthenticated, (req, res, next) => {
  // If checkNotAuthenticated middleware passes, this means the user is not authenticated
  return res.json({ isAuthenticated: false });
});

// Login route
router.post('/login', async (req, res, next) => {
  try {
    const user = await getUserByUsername(req.body.username);
    const rememberMe = req.body['checkbox-remember-me'] === 'on';

    if (!user) {
      return res.json({ message: "Invalid email"});
    }

    // Compare plaintext password with hashed password
    bcrypt.compare(req.body.password, user.password, (bcryptErr, isMatch) => {
      if (bcryptErr) {
        return res.json({ message: "Invalid password" });
      }

      if (isMatch) {
        // Passwords match, proceed with login
        req.logIn(user, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }

          // Set a cookie with a longer expiration time if "Remember Me" is selected
          if (rememberMe) {
            req.session.cookie.maxAge = 604800000;     // 1 week for "Remember Me", 1 hour otherwise
          } else {
            req.session.cookie.maxAge = 3600000;          
          }
          return res.json({ 
            success: "ok", 
            id: user._id
          });
        });
      } else {
        // Passwords do not match
        return res.json({ message: "Invalid password" });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Logout route
router.post('/logout', checkAuthenticated ,(req, res) => {
  req.logout(() => {  // Clear login session
    req.session.destroy(); // Destroy the session
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.json({ success: true, message: 'Logout successful' });
  });
});

// Update user profile route
router.post('/:id', upload.single('profilePicture'), async (req, res, next) => {
  try {
    const userId = req.params.id;
    const editedText = req.body.description;
    
    // Access file from memory using req.file
    const profilePicture = req.file;
    const user = await Users.findOne({ _id: userId });
    console.log("Received image:", req.file);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    user.description = editedText;

    // Check if a file was uploaded
    if (profilePicture) {
      user.image = {
        name: profilePicture.originalname,
        encoding: profilePicture.encoding,
        mimetype: profilePicture.mimetype,
        buffer: profilePicture.buffer,
      };    
    }
    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get user details route
router.get('/:id', checkAuthenticated, async (req, res, next) => {
  try {
    const userId = req.params.id;
    var user = await Users.findOne({_id: userId})
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Return user data as needed
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a random unliked user route
router.get('/:id/unliked-user', checkAuthenticated, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const currentUser = await Users.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the IDs of users the current user has liked
    const likedUserIds = currentUser.likes.map(like => like.toString());

    // Find all unliked users
    const unlikedUsers = await Users.find({ _id: { $nin: [...likedUserIds, userId] } });

    if (!unlikedUsers || unlikedUsers.length === 0) {
      return res.json({ message: 'No unliked users found' });
    }

    // Select a random unliked user
    const randomIndex = Math.floor(Math.random() * unlikedUsers.length);
    const randomUnlikedUser = unlikedUsers[randomIndex];

    return res.json(randomUnlikedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Like a user route
router.post('/:id/like', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const likedUserId = req.body.user_id; // Get the liked user_id from the body

    // Find the current user and liked user
    const currentUser = await Users.findById(userId);
    const likedUser = await Users.findById(likedUserId);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the liked user is already in the likedUsers list
    if (currentUser.likes.includes(likedUserId)) {
      console.log(currentUser.likes);
      return res.json({ message: 'User already liked' });
    }

    // Add the liked user to the likedUsers list
    currentUser.likes.push(likedUserId);

    // If both users like each other add the users to the matches
    if (likedUser.likes.includes(userId)) {
      likedUser.matches.push(userId);
      currentUser.matches.push(likedUserId);
      await likedUser.save();
      await currentUser.save();
      return res.json({ success: true, message: "It's a match!" });
    }

    await currentUser.save();

    return res.json({ success: true, message: 'User liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
