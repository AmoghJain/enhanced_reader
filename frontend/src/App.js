/*
 * =================================================================
 * Main React Component: App.js (Corrected .mjs worker)
 * =================================================================
 * This file contains all logic for our PDF viewer.
 * It is configured to work with a local .mjs worker file,
 * which is required for modern versions of pdfjs-dist.
 * =================================================================
 */

// ---
// Section 1: Imports
// ---
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// CSS Imports for react-pdf (v7+).
// These are required for text selection and annotations to work.
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Import our custom stylesheet
import './App.css';

// ---
// Section 2: PDF.js Worker Configuration
// ---
// ⚠️ THIS IS THE FIX ⚠️
// We are pointing to the '.mjs' file that we just copied
// into our 'public' folder.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

/**
 * =================================================================
 * The Main App Component
 * =================================================================
 */
function App() {
  
  // ---
  // Section 3: Component State
  // ---
  
  // State for the total number of pages. 'null' until PDF is loaded.
  const [numPages, setNumPages] = useState(null);

  // State for the current page number. Starts at 1.
  const [pageNumber, setPageNumber] = useState(1);

  // ---
  // Section 4: Event Handlers
  // ---

  /**
   * Callback for when the PDF successfully loads.
   */
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1); 
  }

  /**
   * Goes to the previous page, stopping at 1.
   */
  function goToPrevPage() {
    setPageNumber(prevPageNumber => Math.max(1, prevPageNumber - 1));
  }

  /**
   * Goes to the next page, stopping at the last page.
   */
  function goToNextPage() {
    setPageNumber(prevPageNumber => Math.min(numPages, prevPageNumber + 1));
  }

  // ---
  // Section 5: Constants
  // ---
  
  // The URL of our Python backend.
  const pdfUrl = "http://127.0.0.1:8000/get-pdf";

  // ---
  // Section 6: JSX Render
  // ---
  return (
    <div className="App">
      
      <header className="App-header">
        <h1>React PDF Viewer</h1>
      </header>
      
      <div className="pdf-container">
        
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          // Log errors to the console if they happen
          onLoadError={(error) => console.error("Error loading PDF:", error.message)}
          loading="Loading PDF..."
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={true}
          />
        </Document>
        
        {/* Only show controls *after* PDF is loaded (numPages is not null) */}
        {numPages && (
          <div className="page-controls">
            
            <button
              disabled={pageNumber <= 1}
              onClick={goToPrevPage}
            >
              Previous
            </button>
            
            <span>
              Page {pageNumber} of {numPages}
            </span>
            
            <button
              disabled={pageNumber >= numPages}
              onClick={goToNextPage}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Export the component
export default App;