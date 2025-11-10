import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration: {type: Number},
    price: {type: Number},
    description: {type: String}
})

export default mongoose.model('Services', userSchema);