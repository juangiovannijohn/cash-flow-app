const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  pass: { type: String, required: true }, // hashed?
  role: { type: String, enum: ["user", "admin", "public"], default: "user", required: true }, // enum type
  name: { type: String },
  lastname: { type: String },
  birthday: { type: Date, max: Date.now },
  country: { type: String },
  city: { type: String },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }]
}, {
  timestamps: true, // createdAt, updatedAt
  versionKey: false
});

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
