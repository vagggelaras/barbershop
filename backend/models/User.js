import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {type: String, required : true, unique: true},
    name: {type: String, required: true},
    role: {type: String, enum: ['customer', 'barber', 'admin'], default: 'customer'},
    phone: {type: String, required : true},
    createdAt: {type: Date, default: Date.now},
    password: {type: String}
})

export default mongoose.model('User', userSchema);