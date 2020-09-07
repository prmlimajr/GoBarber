import mongoose from 'mongoose';

const mongoConnection = () =>
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    })
    .then(() => {
      console.log('Conectado ao MongoDB');
    })
    .catch((err) => console.log(err));

export default mongoConnection;
