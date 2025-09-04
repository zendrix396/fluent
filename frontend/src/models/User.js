import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: false // Optional for OAuth users
  },
  provider: {
    type: String,
    default: 'credentials' // 'credentials' or 'google'
  },
  image: {
    type: String,
    required: false
  },
  requestCount: {
    type: Number,
    default: 0
  },
  lastRequest: {
    type: Date,
    default: Date.now
  },
  isPremium: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model("User", userSchema);
