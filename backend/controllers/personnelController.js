import Personnel from "../models/Personnel.js"

export const getAllPersonnel = async (req, res) => {
    try {
        const personnel = await Personnel.find()
        res.json(personnel)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}