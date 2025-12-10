import { Response } from 'express';
import { User, Follower, Recipe, Favorite } from '../models';
import { HttpErrors } from '../helpers';
import { uploadToCloudinary } from '../config/cloudinary';
import {
    AuthenticatedRequest,
    UserWithStatsResponse,
    FollowersResponse,
    FollowingResponse,
    FollowerWithFollowerUser,
    FollowerWithFollowedUser,
} from '../types';

/**
 * Get current user with aggregated stats
 * @route GET /api/users/current
 */
export const getCurrentUser = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
        throw HttpErrors.Unauthorized('Not authorized');
    }

    const user = await User.findByPk(userId);

    if (!user) {
        throw HttpErrors.NotFound('User not found');
    }

    // Get counts
    const [recipesCount, favoritesCount, followersCount, followingCount] = await Promise.all([
        Recipe.count({ where: { ownerId: userId } }),
        Favorite.count({ where: { userId } }),
        Follower.count({ where: { userId } }),
        Follower.count({ where: { followerId: userId } }),
    ]);

    const response: UserWithStatsResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        recipesCount,
        favoritesCount,
        followersCount,
        followingCount,
    };

    res.json(response);
};

/**
 * Get user by ID (public info)
 * @route GET /api/users/:id
 */
export const getUserById = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
        throw HttpErrors.NotFound('User not found');
    }

    // Get public counts (recipes and followers only)
    const [recipesCount, followersCount] = await Promise.all([
        Recipe.count({ where: { ownerId: id } }),
        Follower.count({ where: { userId: id } }),
    ]);

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        recipesCount,
        followersCount,
    });
};

/**
 * Update user avatar
 * @route PATCH /api/users/avatar
 */
export const updateAvatar = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
        throw HttpErrors.Unauthorized('Not authorized');
    }

    if (!req.file) {
        throw HttpErrors.BadRequest('No file uploaded');
    }

    // Upload to Cloudinary
    const avatarUrl = await uploadToCloudinary(req.file.buffer, 'avatars');

    // Update user
    await User.update({ avatar: avatarUrl }, { where: { id: userId } });

    const user = await User.findByPk(userId);

    if (!user) {
        throw HttpErrors.NotFound('User not found');
    }

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    });
};

/**
 * Get user's followers
 * @route GET /api/users/:id/followers
 */
export const getFollowers = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
        throw HttpErrors.NotFound('User not found');
    }

    // Get followers with user details
    const followers = await Follower.findAll({
        where: { userId: id },
        include: [
            {
                model: User,
                as: 'followerUser',
                attributes: ['id', 'name', 'avatar'],
            },
        ],
    }) as (Follower & FollowerWithFollowerUser)[];

    const response: FollowersResponse = {
        followers: followers.map((f) => ({
            id: f.followerUser.id,
            name: f.followerUser.name,
            avatar: f.followerUser.avatar,
        })),
        total: followers.length,
    };

    res.json(response);
};

/**
 * Get current user's following list
 * @route GET /api/users/following
 */
export const getFollowing = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
        throw HttpErrors.Unauthorized('Not authorized');
    }

    // Get following with user details
    const following = await Follower.findAll({
        where: { followerId: userId },
        include: [
            {
                model: User,
                as: 'followedUser',
                attributes: ['id', 'name', 'avatar'],
            },
        ],
    }) as (Follower & FollowerWithFollowedUser)[];

    const response: FollowingResponse = {
        following: following.map((f) => ({
            id: f.followedUser.id,
            name: f.followedUser.name,
            avatar: f.followedUser.avatar,
        })),
        total: following.length,
    };

    res.json(response);
};

/**
 * Follow a user
 * @route POST /api/users/:id/follow
 */
export const followUser = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const currentUserId = req.user?.id;
    const targetUserId = req.params.id;

    if (!currentUserId) {
        throw HttpErrors.Unauthorized('Not authorized');
    }

    // Can't follow yourself
    if (currentUserId === targetUserId) {
        throw HttpErrors.BadRequest('Cannot follow yourself');
    }

    // Check if target user exists
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
        throw HttpErrors.NotFound('User not found');
    }

    // Check if already following
    const existingFollow = await Follower.findOne({
        where: {
            userId: targetUserId,
            followerId: currentUserId,
        },
    });

    if (existingFollow) {
        throw HttpErrors.Conflict('Already following this user');
    }

    // Create follow relationship
    await Follower.create({
        userId: targetUserId,
        followerId: currentUserId,
    });

    res.status(201).json({ message: 'Successfully followed user' });
};

/**
 * Unfollow a user
 * @route DELETE /api/users/:id/follow
 */
export const unfollowUser = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const currentUserId = req.user?.id;
    const targetUserId = req.params.id;

    if (!currentUserId) {
        throw HttpErrors.Unauthorized('Not authorized');
    }

    // Find and delete follow relationship
    const deleted = await Follower.destroy({
        where: {
            userId: targetUserId,
            followerId: currentUserId,
        },
    });

    if (deleted === 0) {
        throw HttpErrors.NotFound('Not following this user');
    }

    res.status(204).send();
};
