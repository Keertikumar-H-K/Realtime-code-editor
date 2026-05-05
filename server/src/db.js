import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://admin:admin123@cluster0.vnwy0gh.mongodb.net/codesync',
      { serverSelectionTimeoutMS: 5000 }
    );

    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ DB Error:', err.message);
    console.log('⚠️  Running with in-memory fallback (rooms will not persist)');
    // Don't exit - continue with in-memory fallback
  }
};