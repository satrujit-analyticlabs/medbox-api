import express from 'express';
import bodyParser from 'body-parser';
import router from './routes.mjs';
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

