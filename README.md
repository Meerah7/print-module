# print-module by KRISHNADHARSHINI
A full-stack web application to upload PDFs, preview documents, select print settings, and place print orders.
1. **PDF Upload & Preview**
- Built using **HTML file input + JavaScript**
- Used **pdf.js** to read and render PDF pages
- All pages are displayed in a scrollable preview using dynamically created `<canvas>` elements
2. **Print Settings**
- Options for:
  - Print Type (Black & White / Color)
  - Number of Copies
  - Page Range (e.g., 1-3,5)
- Implemented using form inputs and JavaScript event listeners
3.**Price Calculation**
- Dynamic pricing based on:
  - Selected pages
  - Number of copies
  - Print type
- Logic written in JavaScript and updates instantly on user input
4. **Order Submission (Backend)**
- Built using **Node.js + Express**
- Used **Multer** to handle file uploads
- Data (file + settings) sent via `FormData` using `fetch()`
5. **Data Storage**
- Orders stored in a local **JSON file**
- Each order contains:
  - File name
  - Pages / selected pages
  - Copies
  - Print type
  - Price
  - Date
  **How It Runs**
1. User uploads a PDF  
2. PDF is rendered in browser (frontend)  
3. User selects print options  
4. Price updates dynamically  
5. On submit:
   - Data is sent to backend API (`/upload`)
   - Order is saved in JSON file  
6. Orders can be viewed separately  
Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **PDF Rendering:** pdf.js  
- **Backend:** Node.js, Express  
- **File Upload:** Multer  
- **Storage:** JSON file  
