const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const register = async (userData) => {
    const { email, password, username } = userData;

    // Check if user already exists
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
        throw new Error('User with this email already exists.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userRepository.createUser({
        email,
        password: hashedPassword,
        username,
        role: 'consumer' // Default role
    });

    return user;
};

const login = async (credentials) => {
    const { email, password } = credentials;

    // Find user
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password.');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password.');
    }

    // Generate JWT
    const payload = {
        id: user.id,
        role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
    
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
};

module.exports = {
    register,
    login
};
