from fastapi import FastAPI, HTTPException
from youtube_transcript_api import YouTubeTranscriptApi
from pydantic import BaseModel
import requests
import os
from decouple import config
import openai



app = FastAPI()

# Create a Pydantic model for the request body
class GenerateBlogPostRequest(BaseModel):
    url: str

# Function to get the YouTube transcript from a given URL
def get_youtube_transcript(url):
    print(url)
    try:
        video_id = url.split("v=")[1]  # Extract the video ID from the YouTube URL
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        text = " ".join([item['text'] for item in transcript])
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get transcript: {str(e)}")

# Define the API route for generating a blog post
@app.post("/api/generate-blog-post")
async def generate_blog_post(request_data: GenerateBlogPostRequest):
    url = request_data.url

    # Get the YouTube transcript
    transcript = get_youtube_transcript(url)

    # Send the transcript to the OpenAI API (GPT-3.5 Turbo)
    openai.api_key = config('OPENAI_API_KEY')

    messages = [
        {"role": "system", "content": "You are a helpful assistant and skilled copywriter. You are skilled at taking transcripts of live talks and turning them into blog posts with the following style: Tone: Informative and Educational. Speak with authority and confidence about the topic. Formality: Informal, yet Technical. Structure: Start with a brief introduction or a catchy statement to grab the reader's attention. Then organize the content into clear sections or categories. Return your response with markdown formatting. The title is heading level one, section subtitles are heading level two. The blog post may also include ordered and unordered lists. Remove indicators like [applause] and [music] from the post. Vocabulary: Use technical terms, but strive for clear and straightforward language to ensure broad understanding. Incorporate domain-specific words when discussing specific topics. Perspective: First Person. Sentence Length and Complexity: Use varied sentence structures to keep the content engaging. Voice: Maintain a style similar to the original transcript."},
        {"role": "user", "content": f"Generate a blog post from the following YouTube transcript:\n\n{transcript} /// Return your response in markdown formatting."}
    ]

    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-16k",
            messages=messages
        )

        generated_blog_post = completion.choices[0].message['content']
        return {'generated_blog_post': generated_blog_post}
    except Exception as e:
        print(f"Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate blog post: {str(e)}")
