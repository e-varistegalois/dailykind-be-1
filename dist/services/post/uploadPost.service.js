"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadPost = void 0;
const moderateText_service_1 = __importDefault(require("./moderateText.service"));
const moderateImage_service_1 = __importDefault(require("./moderateImage.service"));
const uploadToSupabase_service_1 = __importDefault(require("./uploadToSupabase.service"));
const getChallengeById_service_1 = require("../challenge/getChallengeById.service");
const post_repositories_1 = require("../../repositories/post/post.repositories");
const handleUploadPost = async (req) => {
    const { user_id, challenge_id, text } = req.body;
    const file = req.file;
    // validate challenge_id
    if (!challenge_id) {
        throw { status: 400, message: 'challenge_id is required' };
    }
    const challenge = (await (0, getChallengeById_service_1.getChallengeByIdService)(challenge_id)).challenge;
    console.log("challenge wakakak: ", challenge);
    if (!challenge) {
        throw { status: 404, message: 'Invalid challenge_id' };
    }
    if (!text && !file) {
        throw { status: 400, message: 'Text or image required' };
    }
    // check text
    if (text) {
        try {
            const isTextSafe = await (0, moderateText_service_1.default)(text);
            if (!isTextSafe) {
                throw { status: 400, message: 'Caption flagged as inappropriate' };
            }
        }
        catch (e) {
            console.error('MODERATE TEXT ERROR:', e);
            // Jika error dari moderation (specific message), pass through
            if (e.message?.includes('flagged as inappropriate')) {
                throw { status: 400, message: e.message };
            }
            // Jika error API/service lain
            throw { status: 503, message: 'Text moderation service unavailable' };
        }
    }
    // check image
    let imageUrl = null;
    if (file) {
        if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
            throw { status: 400, message: 'Invalid image format' };
        }
        try {
            const safeBuffer = await (0, moderateImage_service_1.default)(file.buffer);
            if (!safeBuffer) {
                throw { status: 400, message: 'Image flagged as inappropriate' };
            }
            const fileName = `posts/${user_id}_${challenge_id}_${Date.now()}.jpg`;
            imageUrl = await (0, uploadToSupabase_service_1.default)(safeBuffer, fileName);
        }
        catch (e) {
            console.error('IMAGE PROCESSING ERROR:', e);
            // Jika error moderation image
            if (e.message?.includes('flagged as inappropriate')) {
                throw { status: 400, message: e.message };
            }
            // Jika error upload
            if (e.message?.includes('Supabase upload failed')) {
                throw { status: 500, message: 'Image upload failed. Please try again.' };
            }
            // Error lain
            throw { status: 503, message: 'Image processing service unavailable' };
        }
    }
    // simpan ke DB
    const createdPost = await (0, post_repositories_1.createPost)({ user_id, challenge_id, text: text || undefined, image_url: imageUrl || undefined });
    return {
        message: 'Post uploaded successfully',
        image_url: createdPost.imageUrl,
        text: createdPost.content,
    };
};
exports.handleUploadPost = handleUploadPost;
