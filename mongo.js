import mongoose from 'mongoose';
import dotenv from 'dotenv';

// dotenv.config();

if (process.argv.length < 3) {
  console.log('Please provide the password');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://m001-student:${password}@sandbox.r3zsv.mongodb.net/phonebookp3?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model('Person', personSchema);

const createNewContact = () => {
  const firstName = process.argv[3];
  const phoneNumber = process.argv[4];
  const person = new Person({
    name: firstName,
    number: phoneNumber,
  });
  person.save().then((res) => {
    console.log('person saved');
    mongoose.connection.close();
  });
};

const fetchPeople = () => {
  console.log('Phonebook');
  Person.find({}).then((result) =>
    result.forEach((p) => {
      console.log(`${p.name} ${p.number}`);
      mongoose.connection.close();
    })
  );
};

if (process.argv.length === 3) {
  fetchPeople();
} else {
  createNewContact();
}
