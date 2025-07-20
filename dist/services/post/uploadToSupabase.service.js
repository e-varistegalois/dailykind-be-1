"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = uploadToSupabase;
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function uploadToSupabase(buffer, path) {
    const { error } = await supabase.storage
        .from('dailykind-bucket')
        .upload(path, buffer, {
        contentType: 'image/jpeg'
    });
    if (error)
        throw new Error('Supabase upload failed: ' + error.message);
    const { data: publicUrlData } = supabase.storage
        .from('dailykind-bucket')
        .getPublicUrl(path);
    return publicUrlData.publicUrl;
}
