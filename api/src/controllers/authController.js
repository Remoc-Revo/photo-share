const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = await authService.register({ email, password, username });
        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.login({ email, password });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict'
        });

        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = {
    register,
    login
};
