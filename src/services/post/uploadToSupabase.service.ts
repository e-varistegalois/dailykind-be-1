import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function uploadToSupabase(buffer: Buffer, path: string): Promise<string> {
  const { error } = await supabase.storage
    .from('dailykind-bucket')
    .upload(path, buffer, {
      contentType: 'image/jpeg'
    });

  if (error) throw new Error('Supabase upload failed: ' + error.message);

  const { data: publicUrlData } = supabase.storage
    .from('dailykind-bucket')
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
}
