require('dotenv').config();
const mongoose = require('mongoose');
const AboutContent = require('../src/models/AboutContent');

const clearAbout = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await AboutContent.deleteMany({});
    console.log('Deleted existing AboutContent documents:', result.deletedCount);

    process.exit(0);
  } catch (err) {
    console.error('Error clearing AboutContent:', err);
    process.exit(1);
  }
};

clearAbout();
