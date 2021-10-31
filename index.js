import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import './models/phonebook.js';
import Person from './models/phonebook.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('build'));

// app.use(morgan('tiny'));
morgan.token('body', (req, res) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :response-time ms :res[content-length] :res[header]'));
app.use(
  morgan(':method :url :status :req[content-length] - :response-time ms :body')
);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return res.status(404).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

// let people = [
//   {
//     id: 1,
//     name: 'Arto Hellas',
//     number: '040-123456',
//   },
//   {
//     id: 2,
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//   },
//   {
//     id: 3,
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//   },
//   {
//     id: 4,
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//   },
// ];

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  // const match = Person.find((p) => p.name === body.name);

  // if (!body.name || !body.number) {
  //   return res.status(404).json({ error: 'The name or number is missing' });
  // }
  // if (match) return res.status(404).json({ error: 'name must be unique' });

  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => res.json(savedAndFormattedPerson))
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => {
      next(error);
    });
});

// app.get('/api/persons', (req, res) => {
//   res.json(people);
// });

// app.get('/info', (req, res) => {
//   res.send(`<p>phonebook has info for 4 people</p> <p>${new Date()}</p> `);
// });

// app.get('/api/persons/:id', (req, res) => {
//   const id = +req.params.id;
//   const person = people.find((p) => p.id === id);

//   if (!person) return res.status(404).end();

//   res.json(person);
// });

// app.delete('/api/persons/:id', (req, res, next) => {
//   const id = +req.params.id;
//   const deleteItem = people.filter((p) => p.id !== id);
//   res.status(204).end();
// });

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        return res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

const generateId = () => {
  return Math.floor(Math.random() * 1000);
};

function logger(request, response, next) {
  console.log('log');
  next();
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
  console.log(`listening on port ${PORT}`);
});
