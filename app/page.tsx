'use client'

import { useState } from "react";
import Markdown from "markdown-to-jsx";
import { SpinnerGap } from "@phosphor-icons/react";

export default function Home() {

  const [url, setUrl] = useState<string>("")
  const [videoID, setVideoID] = useState<string | null>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [blogPost, setBlogPost] = useState<string>("")
  

  const extractVideoIdFromString = (urlString: string): string | null => {
    try {
      const url = new URL(urlString);
      return url.searchParams.get("v");
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  }
  
  const handleGenerateBlogPost = async () => {
    setLoading(true)
    const extractedVideoID: string | null = extractVideoIdFromString(url)
    setVideoID(extractedVideoID)
    try {
        const response = await fetch('/api/generate-blog-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({url: url}),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            setBlogPost(data.generated_blog_post);
        } else {
            console.error('Failed to generate the blog post');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
      setLoading(false)
    }
};

  return (
    <main className="flex flex-col items-center min-h-screen w-screen">
      <div className="my-24 items-center justify-around font-mono text-sm">
        <input 
          type="text" 
          name="youtubelink" 
          id="youtubelink" 
          placeholder="paste youtube link" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="backdrop-blur-2xl w-[28rem] rounded-xl border-2 border-gray-100 bg-gray-100 p-4" />
        <button
          onClick={handleGenerateBlogPost} 
          className="shadow w-56 h-14 ml-8 rounded-xl bg-green-700/90 active:bg-green-700 text-gray-100 font-semibold p-4">
            {!loading ? (
              `generate blog post`
            ) : (
              <div className="flex flex-row justify-center items-center">
                <span>loading</span>
                <SpinnerGap size={22} className="animate-spin ml-2"/>
              </div>
            )}
            </button>
        
      </div>
      <div className="w-[40rem]">
        {videoID && <img 
        src={`https://img.youtube.com/vi/${videoID}/hqdefault.jpg`}
        alt=""
        className="w-full mb-6" />}
        <Markdown>{blogPost}</Markdown>
      </div>
      
    </main>
  );
}