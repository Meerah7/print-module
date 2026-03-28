document.addEventListener("DOMContentLoaded", () => {

    // ✅ PDF worker
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

    // ✅ Elements
    const fileInput = document.getElementById("fileInput");
    const fileName = document.getElementById("fileName");
    const pageCountText = document.getElementById("pageCount");
    const printType = document.getElementById("printType");
    const copiesInput = document.getElementById("copies");
    const priceText = document.getElementById("price");
    const container = document.getElementById("pdfContainer");
    const pageRangeInput = document.getElementById("pageRange");

    let pdfDoc = null;
    let totalPages = 0;

    // ✅ Upload PDF
    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];

        if (!file || file.type !== "application/pdf") {
            alert("Please upload a PDF file");
            return;
        }

        fileName.textContent = "File: " + file.name;

        const reader = new FileReader();

        reader.onload = async function () {
            try {
                const typedarray = new Uint8Array(this.result);

                pdfDoc = await pdfjsLib.getDocument(typedarray).promise;
                totalPages = pdfDoc.numPages;

                pageCountText.textContent = `Pages: ${totalPages} (All selected)`;

                await renderAllPages();
                calculatePrice();

            } catch (err) {
                console.error(err);
                alert("Error loading PDF");
            }
        };

        reader.readAsArrayBuffer(file);
    });

    // ✅ Render all pages
    async function renderAllPages() {
        container.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const page = await pdfDoc.getPage(i);

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const viewport = page.getViewport({ scale: 1.2 });

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
                canvasContext: ctx,
                viewport: viewport
            }).promise;

            canvas.style.width = "100%";
            canvas.style.marginBottom = "15px";

            container.appendChild(canvas);
        }
    }

    // ✅ Get selected pages count
    function getSelectedPages() {
        const input = pageRangeInput.value.trim();

        if (!input) return totalPages;

        let count = 0;
        const parts = input.split(",");

        for (let part of parts) {
            if (part.includes("-")) {
                let [start, end] = part.split("-").map(Number);

                if (!start || !end || start > end || end > totalPages) {
                    return 0; // invalid
                }

                count += (end - start + 1);
            } else {
                let num = Number(part);
                if (!num || num > totalPages) return 0;

                count += 1;
            }
        }

        return count;
    }

    // ✅ Price calculation
    function calculatePrice() {
        if (!totalPages) {
            priceText.textContent = "₹0";
            return;
        }

        const selectedPages = getSelectedPages();

        if (selectedPages === 0) {
            priceText.textContent = "Invalid page range";
            return;
        }

        const type = printType.value;
        const copies = parseInt(copiesInput.value) || 1;
        const pricePerPage = type === "bw" ? 2 : 5;

        const totalPrice = selectedPages * copies * pricePerPage;

        priceText.textContent = `₹${totalPrice}`;
    }

    // ✅ Listeners
    printType.addEventListener("change", calculatePrice);
    copiesInput.addEventListener("input", calculatePrice);
    pageRangeInput.addEventListener("input", calculatePrice);

    // ✅ Save order
    window.saveOrder = async function () {
        const file = fileInput.files[0];

        if (!file) {
            alert("Upload a file first");
            return;
        }

        const selectedPages = getSelectedPages();

        if (selectedPages === 0) {
            alert("Invalid page range");
            return;
        }

        const type = printType.value;
        const copies = parseInt(copiesInput.value) || 1;
        const pricePerPage = type === "bw" ? 2 : 5;
        const totalPrice = selectedPages * copies * pricePerPage;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("pages", totalPages);
        formData.append("selectedPages", selectedPages);
        formData.append("pageRange", pageRangeInput.value || "All");
        formData.append("copies", copies);
        formData.append("type", type);
        formData.append("price", totalPrice);

        try {
            const res = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData
            });

            await res.json();

            alert("✅ Order saved successfully!");

            // ✅ Reset UI
            fileInput.value = "";
            fileName.textContent = "";
            pageCountText.textContent = "";
            priceText.textContent = "₹0";
            copiesInput.value = 1;
            printType.value = "bw";
            pageRangeInput.value = "";
            container.innerHTML = "";

            totalPages = 0;
            pdfDoc = null;

        } catch (err) {
            console.error(err);
            alert("❌ Failed to save order");
        }
    };

});