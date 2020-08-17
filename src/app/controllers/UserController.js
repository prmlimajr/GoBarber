import connection from '../../database/connection';
import bcrypt from 'bcryptjs';

class UserController {
  async store(req, res) {
    const { name, email, password, provider } = req.body;
    const trx = await connection.transaction();
    /**
     * Verifies if the email is already in use.
     */
    const users = await trx('users').select('users.*');
    const userExists = users.filter((user) => user.email === email);

    if (userExists.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    /**
     * encrypts the password.
     */
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = {
      name,
      email,
      password_hash: hashedPassword,
      provider: provider || false,
    };

    /**
     * Gets the user ID for the return.
     * */
    const insertedIds = await trx('users').insert(user);
    const user_id = insertedIds[0];

    await trx.commit();

    return res.json({
      id: user_id,
      ...user,
    });
  }

  async update(req, res) {
    console.log(req.userId);
    return res.json({ ok: true });
  }
}

export default new UserController();
