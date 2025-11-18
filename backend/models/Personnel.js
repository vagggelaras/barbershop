import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {type: String, required : true, unique: true},
    name: {type: String, required: true},
    photo: {type: String, default: ''},
    isActive:{type: Boolean},
    daysOff: {
        type: [String],
        default: []
    },
    services:[String]
}, { collection: 'personnel' })

export default mongoose.model('Personnel', userSchema);