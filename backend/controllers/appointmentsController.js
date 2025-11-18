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

export const getAllAppointmentsByDate = async (req, res) => {
    try {
        const { date } = req.params;

        const appointments = await Appointments.find({ date: date })
            .sort({ time: 1 }); // Sort by time

        res.status(200).json({
            success: true,
            appointments: appointments
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointments.find()
            .sort({ date: -1, time: 1 }); // Sort by date desc, then time asc

        res.status(200).json(appointments)
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

export const deleteAppointment = async (req, res) => {
    try {
        const deletedAppointment = await Appointments.findByIdAndDelete(req.params.id);

        if (!deletedAppointment) {
            return res.status(404).json({ message: 'Το ραντεβού δεν βρέθηκε' });
        }

        res.json({ message: 'Το ραντεβού διαγράφηκε επιτυχώς', deletedAppointment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getUserAppointments = async (req, res) => {
    try {
        const { email } = req.params;

        console.log('Getting appointments for email:', email); // Debug

        const appointments = await Appointments.find({ userEmail: email })
            .sort({ date: 1, time: 1 }); // Sort by date and time ascending

        console.log('Found appointments:', appointments.length); // Debug

        res.status(200).json({
            success: true,
            appointments: appointments
        })
    } catch (error) {
        console.error('Error in getUserAppointments:', error); // Debug
        res.status(500).json({ error: error.message });
    }
}