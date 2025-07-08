import express from "express";
import 'dotenv/config';
import chatbotRoutes from './routes/chatbot/routes';

const app = express()
const port = 3001

app.use(express.json());
app.use('/chatbot', chatbotRoutes);

app.get('/', (_, res) => {
  res.status(200).json({
    message: 'Dailykind backend is running :D'
  });
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
