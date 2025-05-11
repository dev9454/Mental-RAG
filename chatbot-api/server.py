import sys
import time
import asyncio
import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import TextLoader
from langchain_core.documents import Document

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from frontend

# Initialize the LLM
model = OllamaLLM(model="llama3")

# Optimized prompt
template = """
You are a friendly mental health chatbot. Your job is to offer emotional support with **short and relevant** responses.

Use retrieved knowledge to **improve** responses, but keep it concise.

### Conversation History:
{context}

### User Question:
{question}

### Your Response (Rules):
1. Keep responses **short & relevant**.
2. Avoid overly long explanations.
3. Use a **friendly and caring tone**.
"""
prompt = ChatPromptTemplate.from_template(template)

# Initialize vector database
def initialize_vector_db():
    try:
        # Use absolute path to ensure correct file location
        file_path = os.path.join(os.path.dirname(__file__), "mental_health_resources.txt")
        print(f"Attempting to load file: {file_path}")
        loader = TextLoader(file_path)
        docs = loader.load()
        print(f"Loaded {len(docs)} documents")
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vector_store = Chroma.from_documents(docs, embeddings)
        retriever = vector_store.as_retriever(search_kwargs={"k": 1})
        return retriever
    except FileNotFoundError as e:
        print(f"Error: mental_health_resources.txt not found at {file_path}. Using empty retriever. Details: {e}")
        # Create an empty retriever as a fallback
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vector_store = Chroma.from_documents([Document(page_content="")], embeddings)
        return vector_store.as_retriever(search_kwargs={"k": 1})
    except Exception as e:
        print(f"Error initializing vector database: {e}")
        # Fallback to empty retriever
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vector_store = Chroma.from_documents([Document(page_content="")], embeddings)
        return vector_store.as_retriever(search_kwargs={"k": 1})

retriever = initialize_vector_db()

response_times = []

async def generate_response(conversation_history, user_input):
    """Generates an asynchronous chatbot response."""
    if retriever is None:
        return "Error: Retriever not initialized."

    start_time = time.time()

    # Retrieve relevant documents
    try:
        retrieved_docs = await asyncio.to_thread(retriever.invoke, user_input) if retriever else []
        retrieved_texts = "\n".join([doc.page_content for doc in retrieved_docs])
    except Exception as e:
        print(f"Error retrieving documents: {e}")
        retrieved_texts = ""

    # Format prompt
    input_text = prompt.format(context=conversation_history, question=user_input)

    try:
        full_response = await asyncio.to_thread(model.invoke, input_text)
    except Exception as e:
        full_response = f"Error: {e}"

    end_time = time.time()
    response_times.append(end_time - start_time)

    # Adjust response length dynamically
    word_count = len(user_input.split())
    if word_count <= 2:
        response = full_response.split(".")[0]  # Only first sentence
    elif word_count <= 5:
        response = " ".join(full_response.split(".")[:2])  # First two sentences
    else:
        response = full_response  # Full response for deep queries

    return response

@app.route('/api/chat', methods=['POST'])
async def chat():
    """API endpoint to handle chat requests from the frontend."""
    data = request.get_json()
    user_input = data.get('message', '')
    conversation_history = data.get('conversationHistory', '')

    # Generate response
    response = await generate_response(conversation_history, user_input)

    # Update conversation history
    conversation_history += f"User: {user_input}\nChatbot: {response}\n"

    # Return JSON response
    return jsonify({
        'response': response,
        'conversationHistory': conversation_history
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)