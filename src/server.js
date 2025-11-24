import express from 'express';
import bodyParser from 'body-parser';
import generateRoutes from './routes/generateRoutes.js';

const app = express();
app.use(bodyParser.json());

app.use('/', generateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Test Data Agent running on port ${PORT}`));
