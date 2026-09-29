/* const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const diaryRoutes = require("./routes/diaryRoutes");
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

app.use(express.json());

// serve uploads folder
app.use("/uploads", express.static("uploads"));

// diary routes
app.use('/api/auth', authRoutes);
app.use("/api/diaries", diaryRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 */
/* const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // ADD CORS
const diaryRoutes = require("./routes/diaryRoutes");
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder
app.use("/uploads", express.static("uploads"));

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/diaries", diaryRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Diary API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads URL: http://localhost:${PORT}/uploads/`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
}); */
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Import routes
const diaryRoutes = require("./routes/diaryRoutes");
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/diaries", diaryRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Diary API is running",
    timestamp: new Date().toISOString()
  });
});

// Root endpoint - ADD THIS TO FIX "Cannot GET /"
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Diary Plus API</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                max-width: 800px;
                width: 100%;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            h1 {
                color: #333;
                margin-bottom: 10px;
                font-size: 36px;
            }
            .subtitle {
                color: #666;
                margin-bottom: 30px;
                font-size: 18px;
            }
            .status {
                background: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 10px;
                display: inline-block;
                margin-bottom: 30px;
                font-weight: bold;
            }
            .endpoints {
                background: #f5f5f5;
                border-radius: 10px;
                padding: 20px;
                margin-top: 20px;
            }
            .endpoint {
                margin: 15px 0;
                padding: 15px;
                background: white;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }
            .method {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 4px;
                font-weight: bold;
                margin-right: 10px;
                font-size: 14px;
            }
            .get { background: #61affe; color: white; }
            .post { background: #49cc90; color: white; }
            .put { background: #fca130; color: white; }
            .delete { background: #f93e3e; color: white; }
            .url {
                font-family: 'Courier New', monospace;
                color: #333;
            }
            .description {
                color: #666;
                margin-top: 5px;
                font-size: 14px;
            }
            .links {
                margin-top: 30px;
                display: flex;
                gap: 15px;
            }
            .btn {
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            .btn-primary {
                background: #667eea;
                color: white;
            }
            .btn-secondary {
                background: transparent;
                border: 2px solid #667eea;
                color: #667eea;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📓 My Diary Plus API</h1>
            <p class="subtitle">Backend Server is running successfully!</p>
            
            <div class="status">🚀 Status: Online</div>
            
            <div class="endpoints">
                <h3>📋 Available Endpoints:</h3>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/api/health</span>
                    <p class="description">Health check endpoint</p>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="url">/api/auth/register</span>
                    <p class="description">Register new user</p>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="url">/api/auth/login</span>
                    <p class="description">Login user</p>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/api/diaries</span>
                    <p class="description">Get all diaries (requires auth)</p>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="url">/api/diaries</span>
                    <p class="description">Create new diary (requires auth)</p>
                </div>
                
                <div class="endpoint">
                    <span class="method put">PUT</span>
                    <span class="url">/api/diaries/:id</span>
                    <p class="description">Update diary (requires auth)</p>
                </div>
                
                <div class="endpoint">
                    <span class="method delete">DELETE</span>
                    <span class="url">/api/diaries/:id</span>
                    <p class="description">Delete diary (requires auth)</p>
                </div>
            </div>
            
            <div class="links">
                <a href="/api/health" class="btn btn-primary">✅ Health Check</a>
                <a href="/uploads/" class="btn btn-secondary">📁 Uploads Folder</a>
            </div>
            
            <div style="margin-top: 30px; color: #888; font-size: 14px;">
                <p>📁 Uploads URL: http://localhost:5000/uploads/</p>
                <p>🔗 API Base: http://localhost:5000/api</p>
                <p>🕐 Server started: ${new Date().toLocaleString()}</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/my_diary_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads URL: http://localhost:${PORT}/uploads/`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`🌐 Web Interface: http://localhost:${PORT}/`);
});