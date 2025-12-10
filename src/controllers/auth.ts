import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models';
import { HttpErrors } from '../helpers';
import { AuthenticatedRequest, AuthResponse, UserResponse } from '../types';

/**
 * Generate JWT token for user
 */
const generateToken = (id: string): string => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    const options: SignOptions = { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] };
    return jwt.sign({ id }, secret, options);
};

/**
 * Format user response (exclude sensitive data)
 */
const formatUserResponse = (user: User): UserResponse => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
});

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw HttpErrors.Conflict('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user.id);

    // Save token to user
    await user.update({ token });

    const response: AuthResponse = {
        user: formatUserResponse(user),
        token,
    };

    res.status(201).json(response);
};

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw HttpErrors.Unauthorized('Email or password is wrong');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw HttpErrors.Unauthorized('Email or password is wrong');
    }

    // Generate token
    const token = generateToken(user.id);

    // Save token to user
    await user.update({ token });

    const response: AuthResponse = {
        user: formatUserResponse(user),
        token,
    };

    res.json(response);
};

/**
 * Logout user
 * @route POST /api/auth/logout
 */
export const logout = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
        throw HttpErrors.Unauthorized('Not authorized');
    }

    // Clear token
    await User.update({ token: null }, { where: { id: userId } });

    res.status(204).send();
};

/**
 * Get current user (for testing auth)
 * @route GET /api/auth/current
 */
export const current = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const user = req.user;

    if (!user) {
        throw HttpErrors.Unauthorized('Not authorized');
    }

    res.json(formatUserResponse(user as User));
};
