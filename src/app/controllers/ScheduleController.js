import { startOfDay, endOfDay, parseISO } from 'date-fns';
import connection from '../../database/connection';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await connection('users')
      .select('users.*')
      .where({ id: req.userId, provider: true });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await connection('appointments')
      .select('appointments.*')
      .where({ provider_id: req.userId, canceled_at: null })
      .whereBetween('date', [startOfDay(parsedDate), endOfDay(parsedDate)])
      .orderBy('date');

    res.json(appointments);
  }
}

export default new ScheduleController();
