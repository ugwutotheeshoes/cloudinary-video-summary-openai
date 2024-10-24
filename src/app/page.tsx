'use client';
import { useState } from 'react';
import Loader from './Loader';

const POLLING_INTERVAL = 5000;

export default function Home() {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateSummary = async (url: string) => {
    try {
      const response = await fetch(
        `/api/summary?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      console.log(data);

      if (data.available) {
        setSummary(data.summary)
        setIsLoading(false)
      } else {
        setTimeout(() => generateSummary(url), POLLING_INTERVAL);        
      }
    } catch (error: any) {
      console.error('Error checking transcription status:', error);
    }
  };


  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // Prevents the form from refreshing the page
    setIsLoading(true)
    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful', data);
        generateSummary(data.transcriptFileUrl);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <nav className="text-center">
        <div className="flex justify-center my-10 items-center rounded-md border-[1px] px-20 py-2 border-blue-800">
          <form onSubmit={handleUpload}>
            <input type="file" name="video" accept="video/*" />
            <button className="bg-blue-800 text-white p-2 rounded-md uppercase tracking-wider text-sm">
              Upload
            </button>
          </form>
        </div>
        {!summary && <span className="text-xl tracking-wide font-semibold text-center">Upload a video to get an instant summary.</span>}
      </nav>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {isLoading && <Loader size={100} />}
        {summary &&
          <div >
            <h1 className="text-3xl font-semibold text-center mb-3">Video Summary</h1>
            <span>{summary}</span>
          </div>
        }
      </main>
    </div>
  );
}
