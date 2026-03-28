const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

// SAVE ORDER
app.post("/upload", upload.single("file"), (req, res) => {

    const { pages, copies, type, price } = req.body;

    const order = {
        fileName: req.file.originalname,
        pages,
        copies,
        type,
        price,
        date: new Date()
    };

    let orders = [];

    if (fs.existsSync("orders.json")) {
        orders = JSON.parse(fs.readFileSync("orders.json"));
    }

    orders.push(order);

    fs.writeFileSync("orders.json", JSON.stringify(orders, null, 2));

    res.json({ message: "Order saved" });
});

// GET ORDERS
app.get("/orders", (req, res) => {

    if (!fs.existsSync("orders.json")) {
        return res.json([]);
    }

    const data = JSON.parse(fs.readFileSync("orders.json"));
    res.json(data);
});

app.listen(5000, () => console.log("Server running on port 5000"));