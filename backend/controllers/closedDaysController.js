import ClosedDay from "../models/ClosedDays.js"

export const getAllClosedDays = async (req, res) => {
    try {
        const closedDay = await ClosedDay.find()
        res.json(closedDay)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const createClosedDay = async (req, res) => {
    try {
        const { date } = req.body

        // Check if this date already exists
        const existingClosedDay = await ClosedDay.findOne({ date })
        if (existingClosedDay) {
            return res.status(409).json({
                success: false,
                message: 'This date is already marked as closed'
            })
        }

        const newClosedDay = new ClosedDay({ date })
        await newClosedDay.save()

        res.status(201).json({
            success: true,
            message: 'Closed day added successfully',
            closedDay: newClosedDay
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const deleteClosedDay = async (req, res) => {
    try {
        const { id } = req.params
        const deletedClosedDay = await ClosedDay.findByIdAndDelete(id)

        if (!deletedClosedDay) {
            return res.status(404).json({ message: 'Closed day not found' })
        }

        res.json({
            success: true,
            message: 'Closed day deleted successfully',
            closedDay: deletedClosedDay
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}