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
        {"role": "system", "content": "You are a helpful assistant and skilled copywriter."},
        {"role": "user", "content": f"Generate a blog post from the following YouTube transcript:\n\n{transcript} /// Return your response formatted as JSX code with tailwind styling."}
    ]

    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        generated_blog_post = completion.choices[0].message['content']
        return {'generated_blog_post': generated_blog_post}
    except Exception as e:
        print(f"Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate blog post: {str(e)}")
