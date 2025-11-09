import uvicorn
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

# Create the FastAPI app instance
app = FastAPI()

# ---
# Set up CORS (Cross-Origin Resource Sharing)
# This allows your React frontend (running on http://localhost:3000)
# to make requests to this backend (running on http://localhost:8000).
# ---
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# ---
# Define the API endpoint to serve the PDF
# ---
@app.get("/get-pdf")
def get_pdf_file():
    """
    This endpoint serves a PDF file from the server.
    """
    # The path to your PDF file
    pdf_path = "../data/test.pdf"
    
    # Return the file as a response
    # 'media_type="application/pdf"' tells the browser it's a PDF.
    return FileResponse(pdf_path, media_type="application/pdf", filename="MySample.pdf")

# ---
# A simple root endpoint to check if the server is running
# ---
@app.get("/")
def read_root():
    return {"message": "PDF Viewer Backend is running!"}

# ---
# This block allows you to run the app directly with 'python main.py'
# ---
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)