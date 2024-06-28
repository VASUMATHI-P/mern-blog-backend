import express from 'express';

const app = express();

app.get('/', () => {
  console.log('Hello World!');
})

app.listen(3000, () => {
  console.log('app listening on port 3000!')
})
