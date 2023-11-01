'use client'

import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";



export default function Home() {

  const [url, setUrl] = useState("")
  const [blogPost, setBlogPost] = useState("blogy blog")

  const handleGenerateBlogPost = async () => {
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
            setBlogPost(data);
        } else {
            console.error('Failed to generate the blog post');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-3xl items-center justify-around font-mono text-sm lg:flex">
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
          className="shadow w-auto rounded-xl bg-green-700/90 active:bg-green-700 text-gray-100 p-4">generate blog post</button>
        
      </div>
      <div>{blogPost}</div>
      
    </main>
  );
}




// <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//           Get started by editing&nbsp;
//           <Link href="/api/python">
//             <code className="font-mono font-bold">api/index.py</code>
//           </Link>
//         </p>