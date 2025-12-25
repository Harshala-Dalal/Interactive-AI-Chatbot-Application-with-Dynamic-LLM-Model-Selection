from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
#from gpt4all import GPT4All

app = FastAPI()

#model = GPT4All("gpt4all-falcon-q4_0")

# Enable CORS to allow frontend (React) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Test Route - Check if FastAPI is running
@app.get("/")
def read_root():
    return {"message": "FastAPI Backend is Running!"}


# Available models (using open-source LLMs)
AVAILABLE_MODELS = {
    "mistral": "mistral-7b",
    "alpha": "zephyr-7b",
    "phi-2": "microsoft-phi-2",
    "phi-1_5": "microsoft-phi-1_5",
    "instruct": "falcon-7b"
}

# Define request structure
class ChatRequest(BaseModel):
    model: str
    user_message: str

@app.post("/chat")
async def chat_with_llm(request: ChatRequest):
    if request.model not in AVAILABLE_MODELS:
        raise HTTPException(status_code=400, detail="Invalid model selection")

    # Call the respective API for the selected model
    if request.model == "mistral":
        hf_api_url = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
    elif request.model == "alpha":
        hf_api_url = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-alpha"
    elif request.model == "phi-2":
        hf_api_url = "https://api-inference.huggingface.co/models/microsoft/phi-2"
    elif request.model == "phi-1_5":
        hf_api_url = "https://api-inference.huggingface.co/models/microsoft/phi-1_5" 
    elif request.model == "instruct":
        hf_api_url = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct"

    # Append `?wait_for_model=true` for models that support waiting
    if request.model in ["phi-2", "phi-1_5", "mistral"]:  # You can adjust this list based on model support
        hf_api_url += "?wait_for_model=true"
    

    headers = {"Authorization": f"Bearer YOUR_HF_API_KEY"}  # Replace with your Hugging Face API key
    response = requests.post(hf_api_url, json={"inputs": request.user_message}, headers=headers)

    if response.status_code != 200:
        #return {"error": f"Error from Hugging Face: {response.status_code}, {response.text}"}
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch response from LLM")
    
    
    return {"response": response.json()[0]["generated_text"]}

