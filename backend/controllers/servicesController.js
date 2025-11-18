import Service from "../models/Services.js"

export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find()
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createService = async (req, res) => {
    try {
        const { name, duration, price, category } = req.body;

        // Check if service with this name already exists
        const existingService = await Service.findOne({ name });
        if (existingService) {
            return res.status(400).json({ message: 'Υπάρχει ήδη υπηρεσία με αυτό το όνομα' });
        }

        const newService = new Service({
            name,
            duration,
            price,
            category
        });

        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, duration, price, category } = req.body;

        const updatedService = await Service.findByIdAndUpdate(
            id,
            { name, duration, price, category },
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);

        if (!deletedService) {
            return res.status(404).json({ message: 'Η υπηρεσία δεν βρέθηκε' });
        }

        res.json({ message: 'Η υπηρεσία διαγράφηκε επιτυχώς', deletedService });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};