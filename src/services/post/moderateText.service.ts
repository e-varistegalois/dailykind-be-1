import axios from 'axios';

export default async function moderateText(text: string): Promise<boolean> {
  const res = await axios.get('https://api.sightengine.com/1.0/text/check.json', {
    params: {
      text,
      mode: 'standard',
      api_user: process.env.SIGHTENGINE_USER!,
      api_secret: process.env.SIGHTENGINE_SECRET!
    }
  });

  const result = res.data;
  const flagged = result.profanity?.matches?.length > 0 ||
                  result.racism?.matches?.length > 0 ||
                  result.personal?.matches?.length > 0;

  return !flagged;
}
