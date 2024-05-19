import express from 'express';
import { getAllLeads, updateStatus, createLead } from './controllers/leadController';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());

app.get('/leads', getAllLeads);

app.post('/lead', createLead);

app.patch('/lead/:id', updateStatus);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
