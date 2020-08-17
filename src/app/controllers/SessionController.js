import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connection from '../../database/connection';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    const trx = await connection.transaction();

    /**
     * Verifies if the email is already in use.
     */
    const users = await trx('users').select('users.*');
    const userExists = users.filter((user) => user.email === email);

    if (userExists.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const checkPassword = (password) => {
      return bcrypt.compare(password, userExists[0].password_hash);
    };

    if (!(await checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    return res.json({
      user: {
        id: userExists[0].id,
        name: userExists[0].name,
        email,
      },
      token: jwt.sign({ id: userExists[0].id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
