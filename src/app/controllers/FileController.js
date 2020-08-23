import connection from '../../database/connection';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = {
      name,
      path,
    };

    const insertedFile = await connection('files').insert(file);

    console.log();
    return res.json(insertedFile);
  }
}

export default new FileController();
