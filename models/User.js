const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' } // Role field
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {


    // Check if there is any admin user in the database
    const User = mongoose.model('User', userSchema);
    const adminExists = await User.findOne({ role: 'admin' });

    // If no admin exists, make this user the admin
    if (!adminExists) {
      this.role = 'admin';
    }

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
