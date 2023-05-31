const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, minLength: 3, maxLength: 50 },
  text: { type: String, required: true, minLength: 1, maxLength: 560 },
  timestamp: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, requied: true },
});

MessageSchema.virtual('url').get(function () {
  return `/message/${this._id}`;
});

module.exports = mongoose.model('Message', MessageSchema);
