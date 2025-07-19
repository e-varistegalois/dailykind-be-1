import sharp from 'sharp';
import axios from 'axios';
import FormData from 'form-data';

export default async function moderateImage(buffer: Buffer): Promise<Buffer | null> {
  const resized = await sharp(buffer)
    .resize({ width: 1024 })
    .jpeg({ quality: 80 })
    .toBuffer();

  const form = new FormData();
  form.append('media', resized, { filename: 'image.jpg', contentType: 'image/jpeg' });
  form.append('models', 'nudity,wad,offensive');
  form.append('api_user', process.env.SIGHTENGINE_USER!);
  form.append('api_secret', process.env.SIGHTENGINE_SECRET!);

  const res = await axios.post(
    'https://api.sightengine.com/1.0/check.json',
    form,
    { headers: form.getHeaders() }
  );

  const result = res.data;
  const safe = result.nudity?.safe >= 0.85 &&
               !result.weapon && !result.drugs && !result.alcohol;

  return safe ? resized : null;
}
