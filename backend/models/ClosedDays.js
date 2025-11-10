import mongoose from 'mongoose'

const closedDay = new mongoose.Schema({
    date: {type: String, required : true}
})

export default mongoose.model('ClosedDay', closedDay)