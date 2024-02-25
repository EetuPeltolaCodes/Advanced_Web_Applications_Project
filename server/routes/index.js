var express = require('express');
var router = express.Router();
const passport = require('passport')
const Users = require('../models/users');
const Chat = require('../models/chat');
const Message = require('../models/message');
const multer = require('multer');
const initializePassport = require('../middleware/passport-config')

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
initializePassport(passport, getUserByUsername, getUserById)

// Get image route
router.get('/image/:userId', async(req, res, next) => {
  const userId = req.params.userId;
  const user = await Users.findById(userId);
  const image = user.image;
  
  if (!image.name) {
    return res.json({ error: 'Image not found' });
  }
  
  res.setHeader('Content-Type', image.mimetype);
  res.setHeader('Content-Disposition', `inline; filename="${image.name}"`);

  res.send(image.buffer);
});

// Get matches route
router.get('/:userId/matches', checkAuthenticated, async(req, res, next) => {
  const userId = req.params.userId;
  const user = await Users.findById(userId);
  const matches = user.matches;

  res.json({ matches: matches });
});

// Get chat route
router.get('/chat/:userId1/:userId2', async (req, res, next) => {
  const userId1 = req.params.userId1;
  const userId2 = req.params.userId2;

  try {
    const existingChat = await Chat.findOne({
      $or: [
        { user1: userId1, user2: userId2 },
        { user1: userId2, user2: userId1 },
      ],
    });

    if(!existingChat) {
      await Chat.create({
        user1: userId1,
        user2: userId2,
      });

      return res.json({
        messages: []
      });
    }

    res.json({ messages: existingChat.messages });

  } catch (error) {
    console.error('Error checking chat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get message route
router.get('/message/:messageId', async (req, res, next) => {
  const message_Id = req.params.messageId

  try {
    // Fetch the message
    const message = await Message.findById(message_Id);

    res.json(message);

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Send message route
router.post('/send-message/:userId1/:userId2', async (req, res, next) => {
  const userId1 = req.params.userId1;
  const userId2 = req.params.userId2;
  const information  = req.body.message;

  try {
    // Find the chat between userId1 and userId2
    const chat = await Chat.findOne({
      $or: [
        { user1: userId1, user2: userId2 },
        { user1: userId2, user2: userId1 },
      ],
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Create a new message
    const newMessage = await Message.create({
      chatId: chat._id,
      sentBy: userId1,
      receivedBy: userId2,
      information: information,
    });

    chat.messages.push(newMessage._id);
    await chat.save()

    res.json({
      message: newMessage,
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Check if the user that is trying to logout is logged in 
router.get('/logout', checkAuthenticated, (req, res, next) => {
  res.json({ message: "User is authenticated" });
});

module.exports = router;
