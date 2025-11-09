"""
=================================================================
PDF Viewer Backend Server (main.py)
=================================================================
This server uses FastAPI to create a simple API.
Its primary job is to:
1. Define an API endpoint (a URL) that the frontend can call.
2. When that endpoint is called, it sends back the 'sample.pdf' file.
3. Handle CORS (Cross-Origin Resource Sharing) so our React app
   (running on a different port) is allowed to make requests.
=================================================================
"""

# ---
# Section 1: Imports
# ---
import uvicorn
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

# ---
# Section 2: FastAPI App Initialization
# ---
# Create an instance of the FastAPI class. This 'app' object
# is the main point of interaction for our API.
app = FastAPI()

# ---
# Section 3: CORS (Cross-Origin Resource Sharing) Configuration
# ---
# This is a critical security step. By default, browsers block
# a website on one "origin" (e.g., http://localhost:3000)
# from making requests to a different "origin" (e.g., http://localhost:8000).
# This middleware tells the browser that it's OK to allow
# requests from our React app's origin.

# Define a list of origins that are allowed to make requests.
origins = [
    "http://localhost:3000",  # The default port for create-react-app
]

# Add the CORS middleware to our FastAPI app.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Which origins are allowed
    allow_credentials=True,    # Allow cookies (if we use them later)
    allow_methods=["*"],       # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],       # Allow all request headers
)

# ---
# Section 4: API Endpoints (Routes)
# ---

@app.get("/get-pdf")
def get_pdf_file():
    """
    This is the main API endpoint for fetching the PDF.
    When the frontend makes a GET request to http://127.0.0.1:8000/get-pdf,
    this function will run.
    """
    
    # Define the path to the PDF file we want to serve.
    # This path is relative to where 'main.py' is.
    pdf_path = "sample.pdf"
    
    # Use 'FileResponse' to send the file back.
    # We set 'media_type' to 'application/pdf' to tell the
    # browser what kind of file it is.
    # 'filename' is the default name the browser will use if the user tries to save it.
    return FileResponse(
        pdf_path, 
        media_type="application/pdf", 
        filename="MySample.pdf"
    )

@app.get("/")
def read_root():
    """
    A simple "health check" endpoint.
    If you go to http://127.0.0.1:8000/ in your browser,
    you'll see this message. It's a good way to confirm
    the server is running before testing the frontend.
    """
    return {"message": "PDF Viewer Backend is running!"}

# ---
# Section 5: Server Run Command
# ---
# This 'if' block allows us to run the server by typing
# 'python main.py' in the terminal.
# 'uvicorn.run("main:app", ...)' tells uvicorn to:
#   - Look in the 'main.py' file ('main')
#   - Find the 'app' object ('app')
#   - Run it on host '0.0.0.0' (makes it accessible on your local network)
#   - Use port 8000
#   - Automatically 'reload' the server whenever we save changes to the file.
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)