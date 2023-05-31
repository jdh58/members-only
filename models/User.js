const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, minLength: 2, maxLength: 50 },
  last_name: { type: String, required: true, minLength: 2, maxLength: 50 },
  username: { type: String, required: true, minLength: 3, maxLength: 50 },
  password: { type: String, required: true, minLength: 8, maxLeegth: 100 },
  member: { type: Boolean, required: true },
  admin: { type: Boolean, required: true },
});

UserSchema.virtual('url').get(function () {
  return `/user/${this._id}`;
});

UserSchema.virtual('family_name').get(function () {
  if (!this.first_name) {
    const first_name = '';
  } else {
    const first_name = this.first_name;
  }
  if (!this.last_name) {
    const last_name = '';
  } else {
    const last_name = ` ${this.last_name}`;
  }

  return first_name + last_name;
});

module.exports = mongoose.model('User', UserSchema);
