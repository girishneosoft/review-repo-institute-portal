"use client"
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import Button from '@mui/material/Button';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Box, Paper } from '@mui/material';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};

export default function PDFViewerComponent({ book }: any) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    const goToNextPage = () => {
        if (pageNumber < (numPages as number)) {
            setPageNumber(pageNumber + 1);
        }
    };

    const goToPreviousPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const zoomIn = () => {
        if (scale < 3.0) {
            setScale(scale + 0.1);
        }
    };

    const zoomOut = () => {
        if (scale > 0.1) {
            setScale(scale - 0.1);
        }
    };

    return (
        <div className="pdf-viewer">
            <Box className="pdf-controls" sx={{ display: "flex", justifyContent: "space-between", }} >
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignCenter: "center" }}>
                    <Button
                        variant="outlined"
                        onClick={goToPreviousPage}
                        disabled={pageNumber === 1}
                        size="small"
                    >
                        Previous
                    </Button>
                    <p>
                        Page {pageNumber} of {numPages}
                    </p>
                    <Button
                        variant="outlined"
                        onClick={goToNextPage}
                        disabled={pageNumber === (numPages as number)}
                        size="small"
                    >
                        Next
                    </Button>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={zoomOut}
                        disabled={scale <= 0.1}
                        startIcon={<ZoomOutIcon />}
                        size="small"
                    >
                        Zoom Out
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={zoomIn}
                        disabled={scale >= 3.0}
                        startIcon={<ZoomInIcon />}
                        size="small"
                    >
                        Zoom In
                    </Button>
                </Box>
            </Box>
            <div className="pdf-container">
                <Paper sx={{ mt: 2 }}>
                    <Document
                        file={"https://css4.pub/2015/textbook/somatosensory.pdf"}
                        onLoadSuccess={onDocumentLoadSuccess}
                        options={options}
                    >
                        <Page className="d-flex justify-content-center" pageNumber={pageNumber} scale={scale} />
                    </Document>
                </Paper>
            </div>
        </div>
    );
}
