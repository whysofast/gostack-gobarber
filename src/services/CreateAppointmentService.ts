import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
    provider: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({ date, provider }: RequestDTO): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        );

        const appointmentDate = startOfHour(date);

        const findAppointmenteInSameDate = await appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmenteInSameDate) {
            throw Error("There's another appointment booked for this time");
        }

        const appointment = appointmentsRepository.create({
            provider,
            date: appointmentDate,
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
