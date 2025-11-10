import Appointments from '../models/Appointments.js';

export const specificBarberDateAppointments = async (req, res) => {
    try {
        const { barber, date } = req.params;

        console.log("Searching for:", { barber, date }) // Debug

        const appointments = await Appointments.find({
            barberName: barber,
            date: date
        })

        console.log("Found appointments:", appointments) // Debug

        res.status(200).json({
            success: true,
            appointments: appointments
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createAppointment = async (req, res) => {
    try {
        const { date, time, service, userEmail, userName, barberName, duration, userPhone } = req.body

        const newAppointment = new Appointments({
            date,
            time,
            service,
            userEmail,
            userName,
            barberName,
            duration,
            userPhone
        })

        await newAppointment.save()

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            appointment: newAppointment
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}