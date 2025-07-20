"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
require("./config/scheduler");
const chatbot_routes_1 = __importDefault(require("./routes/chatbot/chatbot.routes"));
const post_route_1 = __importDefault(require("./routes/post/post.route"));
const challenge_routes_1 = __importDefault(require("./routes/challenge/challenge.routes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Basic rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        message: 'Too many requests from this IP, please try again later.'
    }
});
// Apply rate limiting to all routes
app.use(limiter);
// Middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
// Routes
app.use('/post', post_route_1.default);
app.use('/chatbot', chatbot_routes_1.default);
app.use('/challenge', challenge_routes_1.default);
// Health check endpoint
app.get('/', (_, res) => {
    res.status(200).json({
        message: 'Dailykind backend is running :D',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// 404 handler
app.use('*', (_, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});
// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});
app.listen(port, () => {
    console.log(`Dailykind backend server running on port ${port}`);
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Weekly challenge scheduler active - runs every Monday at 09:00 WIB`);
});
