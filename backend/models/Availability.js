import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    slots: [
      {
        day: {
          type: String,
          required: true, // e.g. "Monday", "Tuesday"
        },
        times: [
          {
            start: { type: String, required: true }, // e.g. "09:00"
            end: { type: String, required: true },   // e.g. "10:00"
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Availability = mongoose.model('Availability', availabilitySchema);
export default Availability;
