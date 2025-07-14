// seedMentors.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import imagekit from './config/imageKit.js';
import Mentor from './models/mentorModel.js';
import mentors from './data/mentors.js';

dotenv.config();

const uploadDir = path.join('./uploads');

const seedMentors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Mentor.deleteMany();

    const mentorsWithImages = [];

    for (const mentor of mentors) {
      const imagePath = path.join(uploadDir, mentor.image);
      const fileBuffer = fs.readFileSync(imagePath);

      const uploaded = await imagekit.upload({
        file: fileBuffer,
        fileName: mentor.image,
        folder: '/mentors', // optional ImageKit folder
      });

      mentorsWithImages.push({ ...mentor, image: uploaded.url });
    }

    await Mentor.insertMany(mentorsWithImages);
    console.log('✅ Mentors seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedMentors();
