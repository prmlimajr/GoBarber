import app from './app';
import mongoConnection from './database/mongo';

const PORT = 3333;

mongoConnection();

app.listen(PORT, () => {
  console.log(`Conectado na porta ${PORT}`);
});
