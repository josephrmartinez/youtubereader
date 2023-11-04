'use client'

import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import Markdown from "markdown-to-jsx";


export default function Home() {

  const [url, setUrl] = useState("")
  const [videoID, setVideoID] = useState("cwjs1WAG9CM")
  const [blogPost, setBlogPost] = useState(`# Building Context-Aware Reasoning Applications: A Look into the Future

  ## Introduction:
  In a recent talk at the AI Engineering Summit, we discussed the future of context-aware reasoning applications and the challenges faced by developers. While the advancements in language models such as ChatGPT have been impressive, they're just the beginning of what we can achieve. To create truly personalized and helpful AI assistants, we need to integrate language models into larger systems.
  
  Bringing Context:
  One of the key challenges in building context-aware reasoning applications is providing relevant context to language models so they can reason and respond appropriately. Developers often use an instruction prompting approach, where they explicitly tell the language model how to respond in specific scenarios. This is like giving a new employee an employee handbook that guides their behavior. As the language models improve, zero-shot prompting becomes more valuable, as it allows the model to carry relevant context without explicit instructions.
  
  Another way to provide context is through retrieval augmented generation. In this approach, the language model is given a user question and retrieves relevant context to base its response on. It's like taking an open book test, where the answers are the retrieved text. This method is useful when describing how the language model should respond is difficult, such as determining the appropriate tone or providing structured output.
  
  Fine-tuning the language model's weights is a more advanced technique that is still in its early stages. It involves updating the language model's weights to better align with specific use cases, such as tone or structured data parsing. Fine-tuning allows the model to learn from a large number of examples and adapt accordingly.
  
  Reasoning Approaches:
  To enable context-aware reasoning, developers need to consider different architectural approaches. We categorized some of these approaches based on their complexity and capabilities:
  
  1. Simple Chain: In this approach, a language model call is used to determine the output of the system. It's a straightforward and single-step process that guides the model's response.
  
  2. Chain of Calls: Developers can create a chain of language model calls, allowing them to break down complex tasks into individual components. This approach enables more control over the sequence of steps and the ability to dynamically insert knowledge during the process.
  
  3. Router: A router introduces the language model's ability to decide which steps to take based on the provided context. It determines which prompts, language models, or tools to use for a given task. The router approach offers more flexibility in choosing different paths based on specific conditions.
  
  4. Looping Agent: Complex applications often involve looping agents that perform a series of steps and continuously decide which actions to take. These agents are capable of handling unexpected inputs and adapt dynamically within the loop. They provide a more autonomous experience but require careful design and planning to avoid infinite loops.
  
  5. Autonomous Agent: This approach removes the guardrails of predefined steps and allows the language model to take a more active role in choosing actions. It involves creating a skill set of tools for the model to utilize based on the Voyager paper's concept. The challenge lies in defining the sequences of steps implicitly rather than explicitly.
  
  Challenges and Tooling:
  Architecting context-aware reasoning applications comes with its own set of challenges:
  
  1. Orchestration Layer: Choosing the right cognitive architecture, such as chains, routers, or agents, is crucial. Each architecture has its own strengths and weaknesses, and selecting the appropriate one depends on the specific use case. Tools like LangChain aim to provide prototyping capabilities to experiment with different architectures easily.
  
  2. Data Engineering: Providing the right context to language models often requires data engineering expertise. Loading, transforming, and formatting data for the models can be challenging. Tools like LangSmith assist in debugging and understanding the data flow within complex applications.
  
  3. Prompt Engineering: Prompting plays a vital role in guiding language models. Understanding how prompts are structured and combining contextual information, instructions, retrieved data, and chat history is critical. Interactive playgrounds, like the one provided by LangSmith, enable easy experimentation and debugging of prompt engineering.
  
  4. Evaluation: Evaluating context-aware reasoning applications poses unique challenges. Traditional metrics may not perform well for large unstructured outputs. Intuition and vibe checks remain crucial for evaluating performance. LLM-assisted evaluation and feedback tracking through direct and indirect measures can provide valuable insights for refinement.
  
  5. Collaboration: As these systems become more complex, collaboration between AI engineers, data engineers, data scientists, and subject matter experts becomes crucial. The best skill set for the AI engineer role is still evolving, and tools need to facilitate seamless collaboration and enable different stakeholders to contribute effectively.
  
  Conclusion:
  Building context-aware reasoning applications is still in its early stages, and there are numerous challenges to address. However, with the right tooling, expertise, and collaboration, we can pave the way for more advanced and personalized AI assistants. As the AI engineering community continues to innovate, we are excited to see what the future holds in this rapidly evolving field.
  
  Thank you for joining us at the AI Engineering Summit, and we look forward to the incredible developments that lie ahead.
  
  [Applause] [Music]`)
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
        <img 
        src={`https://img.youtube.com/vi/${videoID}/hqdefault.jpg`}
        alt=""
        className="w-full mb-6" />
        <Markdown>{blogPost}</Markdown>
      </div>
      
    </main>
  );
}