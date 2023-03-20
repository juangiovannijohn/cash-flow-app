const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true ,lowercase: true, trim: true, minlength: 2, maxlength: 100,},
  pass: { type: String, required: true, trim: true, minlength: 2, maxlength: 60, }, // hashed?
  role: { type: String, enum: ["user", "admin", "public"], default: "user" }, // enum type
  name: { type: String ,    trim: true,
    maxlength: 100,},
  lastname: { type: String ,    trim: true,
    maxlength: 100,},
  birthday: { type: Date, max: Date.now },
  country: { type: String,     trim: true,
    maxlength: 100, },
  city: { type: String ,    trim: true,
    maxlength: 100,},
  isActive: {
    type: Boolean,
    default: true
  },
  categories: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId },
      name: { type: String }
    }
  ]
}, {
  timestamps: true, // createdAt, updatedAt
  versionKey: false
});

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
