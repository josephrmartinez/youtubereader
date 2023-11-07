from fastapi import FastAPI, HTTPException
from youtube_transcript_api import YouTubeTranscriptApi
from pytube import YouTube
from pydantic import BaseModel
import os
from decouple import config
import openai
import tiktoken


app = FastAPI()

# Create a Pydantic model for the request body
class TaskRequestData(BaseModel):
    url: str
    task: str

def count_tokens(text: str):
    encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
    num_tokens = len(encoding.encode(text))
    return num_tokens

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

    # Count tokens of transcript
    transcript_tokens = count_tokens(transcript)
    print("transcript tokens:", transcript_tokens)
    
    # Exit if token count is greater than 10k
    if transcript_tokens > 10000:
        raise HTTPException(status_code=400, detail="Transcript exceeds token limit (10,000 tokens).")


    # Get the video title and author
    yt = YouTube(url)
    video_name = yt.title
    channel_name = yt.author

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
        input_usage = completion.usage['prompt_tokens']
        input_cost = (input_usage / 1000) * 0.001

        output_usage = completion.usage['completion_tokens']
        output_cost = (output_usage / 1000) * 0.002

        total_cost = input_cost + output_cost

        return {'completion': {
            'text': completion.choices[0].message['content'], 
            'cost': total_cost, 
            'channel': channel_name}}
    except Exception as e:
        print(f"Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate response: {str(e)}")