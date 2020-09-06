import mongoose from 'mongoose';

const mongoConnection = () =>
  mongoose
    .connect(
      'mongodb+srv://prmlimajr:onegai@cluster0.1rwdi.mongodb.net/gobarber?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
      }
    )
    .then(() => {
      console.log('MongoDB Connected…');
    })
    .catch((err) => console.log(err));

export default mongoConnection;
