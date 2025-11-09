/*
 * =================================================================
 * Main ReactComponent: App.js
 * =================================================================
 * This file contains all logic for our PDF viewer.
 *
 * [NEW] This version now includes:
 * 1. A two-column layout.
 * 2. A scrollable thumbnail sidebar on the left.
 * 3. Click-to-navigate functionality on the thumbnails.
 * 4. An "active" state to highlight the current thumbnail.
 * =================================================================
 */

// ---
// Section 1: Imports
// ---
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './App.css';

// ---
// Section 2: PDF.js Worker Configuration
// ---
// This path points to the worker file in our 'public' folder.
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
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  
  // [NEW] State for zoom level (re-added from previous step)
  const [scale, setScale] = useState(1.0);

  // ---
  // Section 4: Event Handlers & Functions
  // ---

  /**
   * Callback for when any PDF Document successfully loads.
   * We use this for both the main viewer and the thumbnail bar.
   */
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    // We only reset the page number if it's the *first* load
    // This prevents jumping to page 1 when thumbnails load.
    if (pageNumber === 1) {
      setPageNumber(1);
    }
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

  // [NEW] Function to navigate to a specific page (from thumbnails)
  function goToPage(page) {
    setPageNumber(page);
  }

  // [NEW] Zoom In function
  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0)); // Cap at 300%
  }

  // [NEW] Zoom Out function
  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5)); // Floor at 50%
  }

  // ---
  // Section 5: Constants
  // ---
  const pdfUrl = "http://127.0.0.1:8000/get-pdf";

  // ---
  // Section 6: JSX Render
  // ---
  // [CHANGED] The layout is now a flexbox container.
  return (
    <div className="App">
      
      {/* The header for our application */}
      <header className="App-header">
        <h1>React PDF Viewer</h1>
      </header>
      
      {/* [NEW] Main content area, split into two columns */}
      <div className="App-main">
        
        {/* [NEW] Column 1: Thumbnail Sidebar */}
        <div className="thumbnail-sidebar">
          {/* This Document component is *just* for rendering thumbnails.
            We only render it *after* numPages is known, to prevent errors.
          */}
          {numPages && (
            <Document
              file={pdfUrl}
              // We can reuse the same success callback
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {/* Create an array from 1 to numPages and map over it
                to create a thumbnail for each page.
              */}
              {Array.from(new Array(numPages), (el, index) => {
                const page = index + 1;
                // [NEW] Check if this thumbnail is the active one
                const isActive = page === pageNumber;

                return (
                  <div
                    key={`thumb-page-${page}`}
                    // [NEW] Apply 'active' class conditionally
                    className={`thumbnail-item ${isActive ? 'active' : ''}`}
                    // [NEW] Click handler to jump to this page
                    onClick={() => goToPage(page)}
                  >
                    <Page
                      pageNumber={page}
                      width={100} // Fixed width for all thumbnails
                      renderTextLayer={false} // No text layer for thumbs
                      renderAnnotationLayer={false} // No annotation layer
                    />
                    <span className="thumbnail-page-number">
                      {page}
                    </span>
                  </div>
                );
              })}
            </Document>
          )}
        </div>
        
        {/* [NEW] Column 2: Main PDF Viewer Container */}
        <div className="pdf-viewer-container">

          {/* [NEW] Zoom Controls */}
          <div className="zoom-controls">
            <button onClick={zoomOut} disabled={scale <= 0.5}>Zoom Out (-)</button>
            <span>{(scale * 100).toFixed(0)}%</span>
            <button onClick={zoomIn} disabled={scale >= 3.0}>Zoom In (+)</button>
          </div>

          {/* [CHANGED] This container now just holds the main document
            and its page controls.
          */}
          <div className="pdf-document-wrapper">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => console.error("Error loading PDF:", error.message)}
              loading="Loading PDF..."
            >
              <Page 
                pageNumber={pageNumber} 
                renderTextLayer={true}
                // [NEW] Pass the scale state to the Page component
                scale={scale}
              />
            </Document>
          </div>
          
          {/* Page Controls (Previous/Next) */}
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
        </div> {/* End pdf-viewer-container */}
      </div> {/* End App-main */}
    </div>
  );
}

export default App;