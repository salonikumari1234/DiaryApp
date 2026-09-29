/* const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    default: "neutral",
  },
  image: {
    type: String,  
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Diary', diarySchema);
 */
const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'excited', 'calm', 'angry', 'anxious', 'tired', 'neutral'],
    default: "neutral"
  },
  image: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // ADD THIS - links diary to user
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Diary', diarySchema);