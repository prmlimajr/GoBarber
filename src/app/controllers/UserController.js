import connection from '../../database/connection';

class UserController {
  async store(req, res) {
    const { name, email, password_hash, provider } = req.body;
    const trx = await connection.transaction();
    const users = await trx('users').select('users.*');
    const userExists = users.filter((user) => user.email === email);

    if (userExists.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = {
      name,
      email,
      password_hash,
      provider: provider || false,
    };

    const insertedIds = await trx('users').insert(user);

    const user_id = insertedIds[0];

    await trx.commit();

    return res.json({
      id: user_id,
      ...user,
    });
  }
}

export default new UserController();
