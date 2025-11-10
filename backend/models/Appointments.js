import mongoose from 'mongoose';

const Appointments = new mongoose.Schema({
    date: {type: String},
    time: {type: String},
    service: {type: String},
    userEmail: {type: String},
    userName: {type: String},
    barberName: {type: String},
    duration: {type: Number},
    userPhone: {type: String}
}, { collection: 'appointments' })

export default mongoose.model('Appointments', Appointments);