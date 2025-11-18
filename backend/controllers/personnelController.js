import Personnel from "../models/Personnel.js"

export const getAllPersonnel = async (req, res) => {
    try {
        const personnel = await Personnel.find()
        res.json(personnel)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getPersonnelById = async (req, res) => {
    try {
        const personnel = await Personnel.findById(req.params.id)
        if (!personnel) {
            return res.status(404).json({ message: 'Το μέλος προσωπικού δεν βρέθηκε' })
        }
        res.json(personnel)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const createPersonnel = async (req, res) => {
    try {
        const { email, name, isActive, daysOff, services } = req.body

        // Check if personnel with this email already exists
        const existingPersonnel = await Personnel.findOne({ email })
        if (existingPersonnel) {
            return res.status(400).json({ message: 'Υπάρχει ήδη μέλος προσωπικού με αυτό το email' })
        }

        const newPersonnel = new Personnel({
            email,
            name,
            isActive: isActive !== undefined ? isActive : true,
            daysOff: daysOff || [],
            services: services || []
        })

        const savedPersonnel = await newPersonnel.save()
        res.status(201).json(savedPersonnel)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const updatePersonnel = async (req, res) => {
    try {
        const { email, name, isActive, daysOff, services } = req.body

        // Check if email is being changed and if it already exists
        if (email) {
            const existingPersonnel = await Personnel.findOne({
                email,
                _id: { $ne: req.params.id }
            })
            if (existingPersonnel) {
                return res.status(400).json({ message: 'Υπάρχει ήδη μέλος προσωπικού με αυτό το email' })
            }
        }

        const updatedPersonnel = await Personnel.findByIdAndUpdate(
            req.params.id,
            { email, name, isActive, daysOff, services },
            { new: true, runValidators: true }
        )

        if (!updatedPersonnel) {
            return res.status(404).json({ message: 'Το μέλος προσωπικού δεν βρέθηκε' })
        }

        res.json(updatedPersonnel)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const deletePersonnel = async (req, res) => {
    try {
        const deletedPersonnel = await Personnel.findByIdAndDelete(req.params.id)

        if (!deletedPersonnel) {
            return res.status(404).json({ message: 'Το μέλος προσωπικού δεν βρέθηκε' })
        }

        res.json({ message: 'Το μέλος προσωπικού διαγράφηκε επιτυχώς', deletedPersonnel })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
} 