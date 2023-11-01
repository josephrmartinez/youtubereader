from fastapi import FastAPI, HTTPException
from youtube_transcript_api import YouTubeTranscriptApi
from pydantic import BaseModel
import requests
import os

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
    
    # test returning just the transcript doc
    return transcript

    # Send the transcript to the OpenAI API
    # Replace 'YOUR_API_KEY' with your actual OpenAI API key
    # api_key = os.environ.get('OPENAI_API_KEY')
    # openai_url = 'https://api.openai.com/v1/engines/davinci-codex/completions'

    # headers = {
    #     'Authorization': f'Bearer {api_key}',
    #     'Content-Type': 'application/json'
    # }

    # prompt = f"Generate a blog post from the following YouTube transcript:\n\n{transcript}"

    # data = {
    #     'prompt': prompt,
    #     'max_tokens': 3000  # Adjust as needed
    # }

    # try:
    #     response = requests.post(openai_url, json=data, headers=headers)

    #     if response.status_code == 200:
    #         generated_blog_post = response.json()
    #         return {'generated_blog_post': generated_blog_post['choices'][0]['text']}
    #     else:
    #         raise HTTPException(status_code=500, detail="Failed to generate the blog post")
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Failed to generate blog post: {str(e)}")
