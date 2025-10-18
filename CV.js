document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('download-btn');
    const resumeElement = document.getElementById('resume');

    // Add an event listener to the download button
    downloadBtn.addEventListener('click', () => {
        // 1. HIDE THE BUTTON BEFORE CAPTURE
        downloadBtn.style.display = 'none'; 

        // Use html2canvas to capture the resume element as a canvas image
        html2canvas(resumeElement).then(canvas => {
            
            // 2. SHOW THE BUTTON IMMEDIATELY AFTER CAPTURE
            downloadBtn.style.display = ''; // Restores the button to its original display style

            // Initialize jsPDF with the correct orientation and units
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Calculate the aspect ratio to maintain image quality
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            
            // Add the image to the PDF
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Handle pages that overflow
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // --- NEW DOWNLOAD LOGIC ---
            // Convert the PDF document to a Blob
            const pdfBlob = pdf.output('blob');

            // Create a temporary URL for the Blob
            const url = URL.createObjectURL(pdfBlob);

            // Create a temporary anchor tag for the download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Marx-Toritseju-Resume.pdf'; // Set the filename
            document.body.appendChild(link);

            // Programmatically click the link to trigger the download
            link.click();

            // Clean up by removing the link and revoking the URL
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            // --- END NEW DOWNLOAD LOGIC ---
        });
    });
});