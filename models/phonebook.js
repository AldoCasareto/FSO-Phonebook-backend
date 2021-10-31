import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_URL;

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to mongo');
  })
  .catch((error) => {
    console.log('error', error.message);
  });

const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: [3, 'must be at least 3 characters'],
    required: true,
  },
  number: {
    type: String,
    minlength: [8, 'must be at least 8 characters'],
    required: true,
  },
});

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model('Person', phoneSchema);
