import User from '../models/User.js';

export const getUser = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({email})
        
        //user not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        //successful login
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                email: user.email,
                name: user.name,
                phone: user.phone
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