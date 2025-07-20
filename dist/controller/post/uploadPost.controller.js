"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPostController = void 0;
const uploadPost_service_1 = require("../../services/post/uploadPost.service");
const uploadPostController = async (req, res) => {
    console.log('MASUK CONTROLLER', req.body, req.file);
    try {
        const result = await (0, uploadPost_service_1.handleUploadPost)(req);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
    }
};
exports.uploadPostController = uploadPostController;
