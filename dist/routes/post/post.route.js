"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const uploadPost_controller_1 = require("../../controller/post/uploadPost.controller");
const like_controller_1 = require("../../controller/post/like.controller");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
router.post('/upload-post', upload.single('image'), uploadPost_controller_1.uploadPostController);
router.post('/likes/:postId', like_controller_1.toggleLikeController);
exports.default = router;
