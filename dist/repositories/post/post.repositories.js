"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
const index_1 = require("../../db/index");
const createPost = async (data) => {
    return index_1.prisma.post.create({
        data: {
            userId: data.user_id,
            challengeId: data.challenge_id,
            content: data.text,
            imageUrl: data.image_url,
        },
    });
};
exports.createPost = createPost;
