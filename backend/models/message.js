const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String, // could be user or group
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  chatType: {
    type: String,
    enum: ['private', 'group'],
    default: 'private'
  }
});

module.exports = mongoose.model('Message', messageSchema);
