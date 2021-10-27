import express from 'express';
import morgan from 'morgan';

const app = express();
app.use(express.json());

// app.use(morgan('tiny'));
morgan.token('body', (req, res) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :response-time ms :res[content-length] :res[header]'));
app.use(
  morgan(':method :url :status :req[content-length] - :response-time ms :body')
);

let people = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (req, res) => {
  res.json(people);
});

app.get('/info', (req, res) => {
  res.send(`<p>phonebook has info for 4 people</p> <p>${new Date()}</p> `);
});

app.get('/api/persons/:id', (req, res) => {
  const id = +req.params.id;
  const person = people.find((p) => p.id === id);

  if (!person) return res.status(404).end();

  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = +req.params.id;
  const deleteItem = people.filter((p) => p.id !== id);
  res.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 1000);
};

app.post('/api/persons', (req, res) => {
  const body = req.body;
  console.log(body);

  const match = people.find((p) => p.name === body.name);

  if (!body.name || !body.number) {
    return res.status(404).json({ error: 'The name or number is missing' });
  }
  if (match) return res.status(404).json({ error: 'name must be unique' });

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  console.log(person);
  res.json(person);
  people = people.concat(person);
});

function logger(request, response, next) {
  console.log('log');
  next();
}
const PORT = 5000;

app.listen(PORT, (req, res) => {
  console.log(`listening on port ${PORT}`);
});
