"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasLiked = exports.deleteLike = exports.createLike = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createLike = async (userId, postId) => {
    await prisma.like.create({
        data: { userId, postId }
    });
    await prisma.post.update({
        where: { id: postId },
        data: {
            likesCount: { increment: 1 }
        }
    });
};
exports.createLike = createLike;
const deleteLike = async (userId, postId) => {
    await prisma.like.delete({
        where: { userId_postId: { userId, postId } }
    });
    await prisma.post.update({
        where: { id: postId },
        data: {
            likesCount: { decrement: 1 }
        }
    });
};
exports.deleteLike = deleteLike;
const hasLiked = async (userId, postId) => {
    return prisma.like.findUnique({
        where: { userId_postId: { userId, postId } }
    });
};
exports.hasLiked = hasLiked;
