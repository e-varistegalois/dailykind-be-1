"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = moderateImage;
exports.getModerationFailureReasons = getModerationFailureReasons;
const sharp_1 = __importDefault(require("sharp"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
async function moderateImage(buffer) {
    try {
        const resized = await (0, sharp_1.default)(buffer)
            .resize({ width: 1024, height: 1024, fit: 'inside' })
            .jpeg({ quality: 80 })
            .toBuffer();
        const form = new form_data_1.default();
        form.append('media', resized, { filename: 'image.jpg', contentType: 'image/jpeg' });
        form.append('models', 'nudity,violence,weapon,offensive,gore,self-harm');
        form.append('api_user', process.env.SIGHTENGINE_USER);
        form.append('api_secret', process.env.SIGHTENGINE_SECRET);
        const res = await axios_1.default.post('https://api.sightengine.com/1.0/check.json', form, {
            headers: form.getHeaders(),
            timeout: 30000
        });
        const result = res.data;
        console.log('MODERATE IMAGE RESULT:', JSON.stringify(result, null, 2));
        // Simplified safety check dengan direct condition
        const isImageSafe = ((result.nudity?.safe || 0) >= 0.9 &&
            (result.nudity?.suggestive || 0) <= 0.2 &&
            (result.nudity?.partial || 0) <= 0.15 &&
            (result.nudity?.raw || 0) <= 0.05 &&
            (result.violence?.prob || 0) <= 0.25 &&
            (result.weapon?.prob || 0) <= 0.3 &&
            (result.offensive?.prob || 0) <= 0.1 &&
            (result.gore?.prob || 0) <= 0.15 &&
            (result.self_harm?.prob || 0) <= 0.1);
        console.log('Image is safe:', isImageSafe);
        if (!isImageSafe) {
            const reasons = getModerationFailureReasons(result);
            console.log('Image rejected for:', reasons.join(', '));
        }
        return isImageSafe ? resized : null;
    }
    catch (error) {
        console.error('Image moderation error:', error);
        return null;
    }
}
function getModerationFailureReasons(result) {
    const checks = [
        [(result.nudity?.safe || 0) < 0.9, 'Adult content detected'],
        [(result.nudity?.suggestive || 0) > 0.2, 'Suggestive content'],
        [(result.nudity?.partial || 0) > 0.15, 'Partial nudity'],
        [(result.nudity?.raw || 0) > 0.05, 'Explicit nudity'],
        [(result.violence?.prob || 0) > 0.25, 'Violence detected'],
        [(result.weapon?.prob || 0) > 0.3, 'Weapons detected'],
        [(result.offensive?.prob || 0) > 0.1, 'Hate/offensive symbols'],
        [(result.gore?.prob || 0) > 0.15, 'Gore/disgusting content'],
        [(result.self_harm?.prob || 0) > 0.1, 'Self-harm content']
    ];
    return checks.filter(([condition]) => condition).map(([, reason]) => reason);
}
