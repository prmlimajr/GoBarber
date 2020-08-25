import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import connection from '../../database/connection';
class AppointmentController {
  async index(req, res) {
    const appointments = await connection('appointments')
      .select('appointments.*')
      .where({ user_id: req.userId, canceled_at: null });

    console.log(appointments);
    if (appointments.length === 0) {
      return res.status(401).json({ error: 'Empty list' });
    }

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().positive().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { provider_id, date } = req.body;

    const providerExists = await connection('users')
      .select('users.*')
      .where({ provider: true, id: provider_id });

    console.log('provider', providerExists);
    if (providerExists.length === 0) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /**
     * parseISO turns the date into an JS date and startOfHour ignores the minutes and takes just the hour.
     */
    const hourStart = startOfHour(parseISO(date));
    console.log('hour', hourStart);

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /**
     * checks for provider availability
     */
    const checkAvailability = await connection('appointments')
      .select('appointments.*')
      .where({ provider_id, canceled_at: null, date: hourStart });

    console.log('check', checkAvailability);
    if (checkAvailability.length > 0) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    if (provider_id === req.userId) {
      return res
        .status(401)
        .json({ error: "Can't schedule an appointment with yourself" });
    }

    const appointment = {
      user_id: req.userId,
      provider_id,
      date: hourStart,
    };

    const booking = await connection('appointments').insert(appointment);

    return res.json(appointment);
  }
}

export default new AppointmentController();
