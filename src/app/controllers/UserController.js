import bcrypt from 'bcryptjs';

import connection from '../../database/connection';

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
    const { email, oldPassword, password } = req.body;
    const trx = await connection.transaction();
    const users = await trx('users').select('users.*');
    const userExists = users.filter((user) => user.id === req.userId);

    if (email !== userExists[0].email) {
      // const userExists = users.filter((user) => user.email === email);

      if (userExists.length === 0) {
        return res.status(400).json({ error: "User doesn't exist" });
      }
    }

    const checkPassword = (password) => {
      return bcrypt.compare(password, userExists[0].password_hash);
    };

    const hashedPassword = password
      ? await bcrypt.hash(password, 8)
      : userExists[0].password_hash;

    if (oldPassword && !(await checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    const user = {
      name: req.body.name || userExists[0].name,
      email: req.body.email || userExists[0].email,
      password_hash: hashedPassword,
    };

    const updated = await trx('users').update(user).where('id', req.userId);

    await trx.commit();

    return res.json({
      id: req.userId,
      ...user,
    });
  }
}

export default new UserController();
