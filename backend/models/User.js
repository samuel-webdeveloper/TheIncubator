import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    role: {
      type: String,
      enum: ['admin', 'mentor', 'mentee'],
      required: true,
    },

    // Common to all users
    bio: {
      type: String,
      default: '',
    },

    // Mentee-specific
    skills: {
      type: [String],
      default: [],
    },
    goals: {
      type: String,
      default: '',
    },

    // Mentor-specific
    specialty: {
      type: String,
      default: '',
    },
    experience: {
      type: String,
      default: '',
    },
    

    availability: {
      type: [
        {
          day: String,         // e.g., "Monday"
          from: String,        // e.g., "10:00"
          to: String           // e.g., "12:00"
        }
      ],
      default: [],
    },
    image: {
      type: String,
      default: '', // optional: add a default profile image
    },

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
