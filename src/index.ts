import express from "express";
import 'dotenv/config';

const app = express()
const port = 3001

app.get('/', (_, res) => {
  res.status(200).json({
    message: 'Hello World!'
  });
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
