# Interactive AI Chatbot Application

This is an chatbot application built using FastAPI for the backend and React for the frontend. The chatbot integrates with open-source LLMs from Hugging Face to generate responses.

** Features
- Uses FastAPI as the backend framework
- React-based frontend with an easy-to-use UI
- Select from multiple open-source LLM models
- Supports CORS to enable frontend-backend communication

---

** Technologies Used

* Backend:
- FastAPI (Python)
- Hugging Face API for LLM integration
- Pydantic for request validation
- CORS middleware for frontend compatibility

* Frontend:
- React (JavaScript)
- CSS Modules for styling
- Lucide-react for icons

---

** Installation and Setup

* Prerequisites:
- Python 3.8+
- Node.js & npm
- Hugging Face API key

* Backend Setup:

1. Create a virtual environment:
   use venv\Scripts\activate
   
2. Install dependencies:
   pip install fastapi uvicorn requests pydantic
   
3. Run the FastAPI server:
   uvicorn main:app --reload
   
4. The API will be available at `http://127.0.0.1:8000`.

* Frontend Setup:

1. Install dependencies:
   npm install
   
2. Start the React development server:
   npm start

3. The frontend will be available at `http://localhost:3000`.

---

** Usage
1. Open the frontend (`http://localhost:3000`).
2. Select a model from the dropdown menu.
3. Type a message and press Enter or click the send button.
4. The chatbot will generate and display a response.
