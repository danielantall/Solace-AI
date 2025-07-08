from fastapi import APIRouter, FastAPI, Request, Response, status, HTTPException, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
import requests
from typing import Optional
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../solace-ai/version1_model/deployment_package')))
from sonar_voice_therapy import SonarVoiceTherapyAssistant

load_dotenv()

router = APIRouter()
API_KEY = os.getenv("SONAR_API_KEY")
if not API_KEY:
    raise ValueError("API key not found. Please ensure SONAR_API_KEY is set in your .env file.")

client = OpenAI(api_key=API_KEY, base_url="https://api.perplexity.ai")

class PromptRequest(BaseModel):
    # For endpoints that may need user context in the future
    entry: Optional[str] = None
    strategy: Optional[str] = "emotion_severity"
    text: Optional[str] = None

@router.post("/api/dailyprompt")
async def perplexity_chat(_: PromptRequest):
    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful assistant that generates unique journal prompts"
                "which help the user reflect introspectively on their life experiences, feelings, and current things which bother them."
                "respond with only the journal prompt, and it must be under 175 characters."
            ),
        },
        {
            "role": "user",
            "content": "Generate a journal prompt for today based on the user's previous entries and current mood",
        },
    ]
    try:
        response = client.chat.completions.create(
            model="sonar-pro",
            messages=messages,
        )
        reply = response.choices[0].message.content
        return {"response": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/morningguidance")
async def morning_guidance(_: PromptRequest):
    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful assistant that provides morning guidance to help the user start their day positively."
                "respond with only the guidance, and it must be under 400 characters. The final sentence should be about a specific action the user should consider doing today"
            ),
        },
        {
            "role": "user",
            "content": "Provide morning guidance for today based on the user's previous entries and current mood",
        },
    ]
    try:
        response = client.chat.completions.create(
            model="sonar-pro",
            messages=messages,
        )
        reply = response.choices[0].message.content
        return {"response": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/tts")
async def tts_endpoint(request: Request):
    data = await request.json()
    text = data.get('text', '')
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="No ElevenLabs API key found")
    voice_id = "Xb7hH8MSUJpSbSDYk0k2"
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json"
    }
    payload = {
        "text": text,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        return Response(content=response.content, media_type="audio/mpeg", headers={
            "Content-Disposition": "inline; filename=output.mp3"
        })
    else:
        raise HTTPException(status_code=response.status_code, detail=response.text)

assistant = SonarVoiceTherapyAssistant(API_KEY)

@router.post("/api/journal")
async def journal_endpoint(req: PromptRequest):
    journal_entry = req.entry or ''
    strategy = req.strategy or 'emotion_severity'
    emotion, severity = assistant.detect_emotion_and_severity(journal_entry)
    response = assistant.get_response(journal_entry, strategy)
    return {
        "response": response,
        "metadata": {
            "emotion": emotion,
            "severity": severity,
            "strategy": strategy,
            "entry_length": len(journal_entry),
            "response_length": len(response)
        }
    }

# If you want to run this as a standalone FastAPI app:
# (Otherwise, import and include router in your main FastAPI app)
if __name__ == "__main__":
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(router)
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
