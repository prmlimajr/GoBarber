import connection from '../../database/connection';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = {
      name,
      path,
    };

    const insertedFile = await connection('files').insert(file);

    const updateUser = await connection('users')
      .update({ avatar_id: insertedFile[0] })
      .where({ id: req.userId });

    return res.json(insertedFile);
  }
}

export default new FileController();
