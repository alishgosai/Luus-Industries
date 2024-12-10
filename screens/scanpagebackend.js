const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure file upload with Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Sample product data (mock database)
const products = {
  "123456789": {
    id: "123456789",
    name: "RS 600MM Oven",
    description:
      "Compact 600mm wide static oven range with burner configurations available. Flat bottom oven design for even heat distribution.",
    dimensions: "600w x 800d x 1100h",
    internalOven: "440w x 550d x 300h",
    cleaning: "Dishwasher safe spillage bowls",
    image: "https://via.placeholder.com/300",
    downloads: {
      specification: "/files/specification.pdf",
      cadDrawing: "/files/cad_drawing.pdf",
      revitFileRS48: "/files/revit_file_rs48.rvt",
      revitFileRS6P: "/files/revit_file_rs6p.rvt",
    },
  },
};

// Routes

// Barcode Scanning (Mock API)
app.get("/api/scan/:barcode", (req, res) => {
  const { barcode } = req.params;
  const product = products[barcode];
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Enquiry Form Submission
app.post("/api/enquiry", upload.single("attachment"), (req, res) => {
  const { name, email, phoneNumber, businessName, location, message } = req.body;
  const file = req.file;

  if (!name || !email || !phoneNumber || !message) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  // Log data (simulate saving to database)
  console.log("Enquiry Submitted:");
  console.log({
    name,
    email,
    phoneNumber,
    businessName,
    location,
    message,
    attachment: file ? file.path : "No file attached",
  });

  res.status(200).json({ message: "Enquiry submitted successfully" });
});

// Static files for downloads
app.use("/files", express.static(path.join(__dirname, "files")));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
