//src/api/upload/route.tsx
import cloudinary from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary with your account details
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request, res: NextResponse) {
  const formData = await req.formData();
  const file = formData.get('video') as File;
  const buffer: Buffer = Buffer.from(await file.arrayBuffer());
  const cloud_name: string | undefined = process.env.CLOUDINARY_CLOUD_NAME;
  const base64Image: string = `data:${file.type};base64,${buffer.toString(
    'base64'
  )}`;

  // Upload the video and generate transcript URL in a chain
  try {
    const uploadResult = await cloudinary.v2.uploader
      .upload(base64Image, {
        public_id: `videos/${Date.now()}`,
        resource_type: 'video',
        raw_convert: 'google_speech',
      })
    const transcriptFileUrl = `https://res.cloudinary.com/${cloud_name}/raw/upload/v${uploadResult.version + 1
      }/${uploadResult.public_id}.transcript`;

    return NextResponse.json(
      { uploadResult, transcriptFileUrl },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
};