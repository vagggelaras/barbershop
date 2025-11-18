import User from '../models/User.js';

export const getUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email})

        //user not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        // Αν ο χρήστης είναι admin, ελέγχουμε τον κωδικό
        if (user.role === 'admin') {
            // Αν δεν έχει σταλεί password, επιστρέφουμε τα στοιχεία του χρήστη χωρίς login
            if (!password) {
                return res.status(200).json({
                    success: false,
                    message: 'Password required for admin',
                    user: {
                        _id: user._id,
                        email: user.email,
                        name: user.name,
                        phone: user.phone,
                        role: user.role
                    }
                })
            }

            // Ελέγχουμε αν ο κωδικός είναι σωστός
            if (user.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: 'Incorrect password'
                })
            }
        }

        //successful login
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role
            }
          })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).json(user)      //201 = created
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, phone } = req.body

        const user = await User.findByIdAndUpdate(
            id,
            { name, email, phone },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({
            _id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};