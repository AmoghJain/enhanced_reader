/*
 * =================================================================
 * Main React Component: App.js
 * =================================================================
 * This file is the heart of our frontend. It defines the 'App'
 * component which is responsible for:
 * 1. Configuring the 'react-pdf' library.
 * 2. Managing state (total pages, current page).
 * 3. Fetching the PDF from our FastAPI backend.
 * 4. Rendering the PDF and page controls.
 * =================================================================
 */

// ---
// Section 1: Imports
// ---
// Import 'React' and the 'useState' Hook.
// 'useState' allows our component to have "state" (memory).
import React, { useState } from 'react';

// Import the main components from 'react-pdf'.
import { Document, Page, pdfjs } from 'react-pdf';

// ⚠️ CSS Imports for 'react-pdf'
// These are required for the text layer and annotation layer
// (like links or selectable text) to render correctly.
// We are using the paths for v7+ of react-pdf.
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Import our custom stylesheet.
import './App.css';

// ---
// Section 2: PDF.js Worker Configuration
// ---
// ⚠️ This is the most critical and complex part of setup.
// 'pdf.js' (the library 'react-pdf' uses) processes PDFs
// using a "worker" file. This runs in a separate thread
// so it doesn't freeze the browser.
//
// We are telling it to load the worker file that we *manually*
// copied into our 'public' folder. This is the most
// reliable method and avoids all the version-mismatch
// errors we were seeing.
//
// This file path *must* match the file we copied in the terminal
// (e.g., pdf.worker.min.mjs).
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
  // 'useState' initializes a piece of state. It returns
  // an array: [currentValue, functionToUpdateIt].

  // This state will hold the total number of pages in the PDF.
  // We start it at 'null' because we don't know it yet.
  const [numPages, setNumPages] = useState(null);

  // This state holds the page number the user is currently viewing.
  // We start it at '1'.
  const [pageNumber, setPageNumber] = useState(1);

  // ---
  // Section 4: Event Handlers & Functions
  // ---

  /**
   * This function is a callback. 'react-pdf' will call it
   * automatically when the <Document> component successfully
   * loads the PDF file.
   * @param {object} pdf - An object containing PDF metadata.
   * @param {number} pdf.numPages - The total page count.
   */
  function onDocumentLoadSuccess({ numPages }) {
    // Update our 'numPages' state with the new value.
    setNumPages(numPages);
    // Reset the page number to 1 (in case a new PDF is loaded).
    setPageNumber(1); 
  }

  /**
   * This function is called when the "Previous" button is clicked.
   */
  function goToPrevPage() {
    // We use a functional update to get the previous page number.
    // 'Math.max(1, ...)' ensures we can't go to page 0 or negative.
    setPageNumber(prevPageNumber => Math.max(1, prevPageNumber - 1));
  }

  /**
   * This function is called when the "Next" button is clicked.
   */
  function goToNextPage() {
    // 'Math.min(numPages, ...)' ensures we can't go past the last page.
    setPageNumber(prevPageNumber => Math.min(numPages, prevPageNumber + 1));
  }

  // ---
  // Section 5: Constants
  // ---
  
  // The URL of our Python backend endpoint.
  // This *must* match the URL defined in 'main.py'.
  const pdfUrl = "http://127.0.0.1:8000/get-pdf";

  // ---
  // Section 6: JSX Render
  // ---
  // This is the HTML-like syntax that React renders to the page.
  return (
    <div className="App">
      
      {/* The header for our application */}
      <header className="App-header">
        <h1>React PDF Viewer</h1>
      </header>
      
      {/* The main container for the PDF and its controls */}
      <div className="pdf-container">
        
        {/*
         * The <Document> component from 'react-pdf'.
         * It is responsible for fetching and loading the PDF.
         */}
        <Document
          // 'file': The URL of the PDF to load.
          file={pdfUrl}
          // 'onLoadSuccess': The function to call when it's done loading.
          onLoadSuccess={onDocumentLoadSuccess}
          // 'onLoadError': A good practice for debugging.
          onLoadError={(error) => console.error("Error loading PDF:", error.message)}
          // 'loading': What to display while the PDF is being loaded.
          loading="Loading PDF..."
        >
          {/*
           * The <Page> component renders one page.
           * It must be *inside* the <Document> component.
           */}
          <Page 
            // 'pageNumber': Which page to show (from our state).
            pageNumber={pageNumber} 
            // 'renderTextLayer': This prop makes text selectable
            // (and requires the CSS file we imported).
            renderTextLayer={true}
          />
        </Document>
        
        {/*
         * Page Controls Section
         * This is a conditional render: 'numPages && (...)'
         * It means "Only render this <div> if 'numPages' is not null"
         * (i.e., only after the PDF has loaded).
         */}
        {numPages && (
          <div className="page-controls">
            
            {/* Previous Page Button */}
            <button
              // 'disabled': This HTML attribute is set to 'true'
              // if we are on page 1, graying out the button.
              disabled={pageNumber <= 1}
              onClick={goToPrevPage}
            >
              Previous
            </button>
            
            {/* The page counter text */}
            <span>
              Page {pageNumber} of {numPages}
            </span>
            
            {/* Next Page Button */}
            <button
              // 'disabled': This is set to 'true' if we are
              // on the last page.
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

// Export the 'App' component so 'index.js' can render it.
export default App;