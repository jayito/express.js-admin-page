const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String },
	createdAt: { type: Date, default: Date.now }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;