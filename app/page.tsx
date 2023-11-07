'use client'

import { useState } from "react";
import Markdown from "markdown-to-jsx";
import { SpinnerGap } from "@phosphor-icons/react";


export default function Home() {

  const [url, setUrl] = useState<string>("")
  const [task, setTask] = useState<string>("")
  const [videoID, setVideoID] = useState<string | null>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [blogPost, setBlogPost] = useState<string>("")
  const [text, setText] = useState<string>("")
  const [cost, setCost] = useState<number>(0)
  

  const extractVideoIdFromString = (urlString: string): string | null => {
    try {
      const url = new URL(urlString);
      return url.searchParams.get("v");
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  }
  
  const performTask = async () => {
    setLoading(true)
    const extractedVideoID: string | null = extractVideoIdFromString(url)
    setVideoID(extractedVideoID)
    try {
        const response = await fetch('/api/perform-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({url: url, task: task}),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            setText(data.completion.text)
            setCost(prevCost => prevCost + data.completion.cost)
        } else {
            console.error('Failed to perform the task');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
      setLoading(false)
    }
};

  return (
    <main className="flex flex-col items-center min-h-screen w-screen">
      <div className="my-24 grid grid-rows-3 gap-5 w-[28rem] items-center font-mono text-sm">
        <input 
          type="text" 
          name="youtubelink" 
          id="youtubelink" 
          placeholder="paste youtube link" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="backdrop-blur-2xl  rounded-xl border-2 border-gray-100 bg-gray-100 p-4" />
          <input 
          type="text" 
          name="task" 
          id="task" 
          placeholder="define task" 
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="backdrop-blur-2xl w-[28rem] rounded-xl border-2 border-gray-100 bg-gray-100 p-4" />
        <div className="grid grid-cols-3">
          <button
          onClick={performTask} 
          className="col-span-2 shadow w-56 h-14 rounded-xl mx-auto bg-green-700/90 active:bg-green-700 text-gray-100 font-semibold p-4">
            {!loading ? (
              `generate`
            ) : (
              <div className="flex flex-row justify-center items-center">
                <span>loading</span>
                <SpinnerGap size={22} className="animate-spin ml-2"/>
              </div>
            )}
            </button>
            <div className="col-span-1 flex content-center items-center">cost: ${cost}</div>

        </div>
        
        
      </div>
      <div className="w-[40rem]">
        {videoID && <img 
        src={`https://img.youtube.com/vi/${videoID}/hqdefault.jpg`}
        alt=""
        className="w-full mb-6" />}
        
        <Markdown>{text}</Markdown>

      </div>
      
    </main>
  );
}
