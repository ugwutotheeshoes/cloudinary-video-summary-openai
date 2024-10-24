import { parseTranscriptData } from '@/lib/transcript';
import { TranscriptData } from '@/types/transcript-data.type';
import { NextResponse, type NextRequest } from 'next/server';
import OpenAI from "openai";


const openai = new OpenAI();
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const url: string | null = searchParams.get('url');

  try {
    const response = await fetch(url as string);

    if (response.ok) {
      const transcriptData: TranscriptData[] = await response.json();
      const transcript: string = await parseTranscriptData(transcriptData);
      const completion = await openai.chat.completions.create({
        model: "gpt-4", // Choose the appropriate model
        messages: [
          { role: "system", content: "You are a helpful assistant that summarizes texts." },
          {
            role: "user",
            content: `Please summarize the following transcript:${transcript}`,
          },
        ],
      });

      const summary = completion.choices[0].message.content;

      return NextResponse.json(
        { available: true, summary },
        { status: 200 }
      );
    } else {

      return NextResponse.json({ available: false }, { status: 400 });
    }
  } catch (error: any) {
    throw new Error(error);
  }
}
