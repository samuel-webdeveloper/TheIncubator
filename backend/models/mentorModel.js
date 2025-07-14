// models/mentorModel.js
import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  speciality: { type: String, required: true },
  experience: { type: String, required: true },
  about: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String, required: true }, // ImageKit URL
}, {
  timestamps: true,
});

const Mentor = mongoose.model('Mentor', mentorSchema);

export default Mentor;
