from fastapi import FastAPI, HTTPException
from youtube_transcript_api import YouTubeTranscriptApi
from pydantic import BaseModel
import os
from decouple import config
import openai


app = FastAPI()

# Create a Pydantic model for the request body
class TaskRequestData(BaseModel):
    url: str
    task: str

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



# Define the API route for performing a task
@app.post("/api/perform-task")
async def perform_task(request_data: TaskRequestData):
    url = request_data.url
    task = request_data.task

    # Get the YouTube transcript
    transcript = get_youtube_transcript(url)

    # Get OpenAI API key
    openai.api_key = config('OPENAI_API_KEY')

    messages = [
        {"role": "system", "content": "You are a helpful assistant. I will provide a transcript of a youtube video and ask you to perform a task."},
        {"role": "user", "content": f"Perform this task: {task} /// Using the following YouTube transcript:\n\n{transcript} /// Return your response in markdown formatting."}
    ]

    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-1106",
            messages=messages
        )
        print(completion)
        # TODO return just text and cost attributes
        return {'completion': {'text': completion.choices[0].message['content'], 'usage': completion.usage}}
    except Exception as e:
        print(f"Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate response: {str(e)}")
