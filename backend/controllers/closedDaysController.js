import ClosedDay from "../models/ClosedDays.js"

export const getAllClosedDays = async (req, res) => {
    try {
        const closedDay = await ClosedDay.find()
        res.json(closedDay)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}