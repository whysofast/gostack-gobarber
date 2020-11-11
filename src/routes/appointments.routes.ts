import { Router } from 'express';
import { parseISO } from 'date-fns';

import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import ensureAuthenticated from '../middlewares/ensureAuthenticatied';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
    console.log(request.user);

    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const allAppointments = await appointmentsRepository.find();

    return response.json(allAppointments);
});

appointmentsRouter.post('/', async (request, response) => {
    try {
        const { provider_id, date } = request.body;

        const parsedDate = parseISO(date);

        const createAppointment = new CreateAppointmentService();

        const appointment = await createAppointment.execute({
            date: parsedDate,
            provider_id,
        });
        return response.json(appointment);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

export default appointmentsRouter;
