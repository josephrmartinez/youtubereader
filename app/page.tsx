'use client'

import { use, useState } from "react";
import Markdown from "markdown-to-jsx";
import { SpinnerGap } from "@phosphor-icons/react";

export default function Home() {


  const post = `# The Rise of the AI Engineer: Embracing the Power of AI

  ## Introduction
  
  As an AI engineer, I believe that we are living in an incredibly exciting time. The rapid advancements in artificial intelligence have opened up new possibilities and opportunities that were once unimaginable. Today, I want to discuss the significance of being an AI engineer and the impact it can have on not only our lives but also on the future of humanity.
  
  ## The Importance of Timing
  
  Before diving into the world of AI engineering, let's take a moment to appreciate the timing of our existence. Throughout history, there have been specific periods where certain fields have thrived. For mathematicians, 600 AD was the perfect time with the invention of zero by Brahma Gupta. Physicists had their golden era between 1905 and 1927, with remarkable contributions from luminaries like Albert Einstein. Similarly, the fields of automobile manufacturing and personal computing reached their peaks during specific time frames.
  
  Now, it is our turn to seize the moment. We are living in the era of the AI Revolution, which began around 2012 with the advent of AlexNet. The exponential growth of computational power has paved the way for unprecedented advancements in AI. We have the opportunity to harness this wave of progress and make a significant impact in the world.
  
  ## The Power of Scaling
  
  One of the key factors driving the AI Revolution is the concept of scaling. We have witnessed a tremendous increase in compute power dedicated to training AI models. This incredible growth has been the catalyst for numerous breakthroughs in the field. Scaling is not just a theoretical concept; it has real implications for the future of AI.
  
  Consider this: we currently have a linear projection that suggests a six-fold increase in compute power by the end of this decade. This means that we can expect significant investments in language models and AI technologies. Furthermore, every advancement in AI, such as GPT-4 and beyond, will involve a six-fold increment in compute power compared to its predecessor. These developments will eventually surpass the cumulative compute power of every human who has ever lived.
  
  Being an AI engineer means riding the wave of these mega-trends. By being at the forefront of the AI Revolution, we have the chance to shape the future and contribute to a field that is greater than any one of us.
  
  ## The AI Engineer: Three Distinct Types
  
  As we delve deeper into the world of AI engineering, it is essential to understand its various dimensions. I believe there are three distinct types of AI engineers, each with its own role and significance:
  
  1. **AI-Enhanced Engineer**: This type of engineer leverages AI tools and technologies to enhance their skills and performance. By embracing AI co-pilots and advanced software, they augment their capabilities, becoming more efficient and innovative.
  
  2. **AI Product Engineer**: These engineers specialize in building AI products that replace human labor. They create cutting-edge solutions like autonomous vehicles, natural language processing systems, and other AI-driven technologies that transform industries and revolutionize the way we live and work.
  
  3. **AI Engineering Agents**: This is the most aspirational category. AI engineering agents are the individuals who strive to create artificial general intelligence (AGI). While AGI remains a grand challenge, the pursuit of creating human-level AI is an ongoing endeavor. These agents push the boundaries of AI research, aiming for advancements that go beyond what currently exists.
  
  It is crucial to note that these categories are not mutually exclusive. Engineers can progress from being AI-enhanced to AI product engineers, and ultimately become AI engineering agents. This progression offers a clear path for career growth and personal development within the AI engineering field.
  
  ## Collaborative Learning and Networking
  
  As AI engineers, we must embrace the power of collaboration and networking. By attending conferences and engaging with other professionals in the field, we can learn from each other's experiences and amplify our knowledge. Building networks of AI engineers is instrumental in creating a community of growth and learning.
  
  I urge you to actively participate in opportunities to connect with fellow AI engineers, speakers, and sponsors. These interactions will enhance your understanding, spark new ideas, and contribute to the collective progress of the AI engineering movement.
  
  ## Becoming a 10x Engineer
  
  Lastly, I want to leave you with a concept that I find quite powerful: the idea of a 10x engineer. While it may not be a technical term, it encapsulates the essence of what it means to be an exceptional AI engineer. A 10x engineer is someone who not only excels in their skills but also empowers and teaches others. By sharing our knowledge and helping others learn, we can create a ripple effect that expands the capabilities and impact of the entire AI community.
  
  In the quest to become a 10x engineer, keep in mind the scaling laws of networks. Attend talks, consume content, and actively engage with AI communities. Share what you learn and help others grow their skills. By cultivating your own network of AI engineers, you contribute to the development and dissemination of knowledge within the field.
  
  Embrace the AI Engineering Journey
  
  In conclusion, being an AI engineer affords us an incredible opportunity to shape the future and make a substantial impact. The rise of AI presents a host of possibilities and challenges, but with the right mindset and a collaborative spirit, we can unlock its full potential.
  
  As you embark on your AI engineering journey, keep in mind the power of timing, the importance of scaling, and the different dimensions of AI engineering. Embrace the concept of being a 10x engineer, and remember that your knowledge and actions can have a transformative effect on the field and the world.
  
  Together, let's push the boundaries, evolve as AI engineers, and make groundbreaking contributions to the ever-growing AI landscape. [Music]`


  const [url, setUrl] = useState("")
  const [videoID, setVideoID] = useState<string | null>("qaJXBMwUkoE")
  const [loading, setLoading] = useState(false)
  const [blogPost, setBlogPost] = useState(post)
  

  function extractVideoIdFromString(urlString: string): string | null {
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