import Service from "../models/Services.js"

export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find()
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};