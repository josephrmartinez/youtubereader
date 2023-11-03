'use client'

import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import Markdown from "markdown-to-jsx";


export default function Home() {

  const [url, setUrl] = useState("")
  const [blogPost, setBlogPost] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerateBlogPost = async () => {
    setLoading(true)
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
    <main className="flex flex-col items-center min-h-screen">
      <div className="my-24 items-center justify-around font-mono text-sm">
        <input 
          type="text" 
          name="youtubelink" 
          id="youtubelink" 
          placeholder="paste youtube link" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="backdrop-blur-2xl w-[28rem] rounded-xl border bg-gray-100 p-4" />
        <button
          onClick={handleGenerateBlogPost} 
          className="shadow w-56 ml-8 rounded-xl bg-green-700/90 active:bg-green-700 text-gray-100 p-4">
            {!loading ? `generate blog post` : `loading`}
            </button>
        
      </div>
      <div className="max-w-prose">
        <Markdown>{blogPost}</Markdown>
      </div>
      
    </main>
  );
}