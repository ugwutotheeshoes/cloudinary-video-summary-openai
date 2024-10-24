import { TranscriptData } from '@/types/transcript-data.type';

export const parseTranscriptData = async (
  data: TranscriptData[]
): Promise<string> => {
  let transcript: string = '';

  data.forEach(
    (line: TranscriptData) => (transcript = transcript + ` ${line.transcript}`)
  );

  return transcript;
};
