const fs = require('fs');
const path = require('path');
const factory = require('../services/factory');
const canvas = require('../services/canvas');

// Paths
const DB_PATH = path.join(__dirname, '../../data/db.json');
const FEED_DIR = path.join(__dirname, '../../public/feed');

// Helper: Read DB safely
const getDb = () => {
    if (!fs.existsSync(DB_PATH)) return [];
    try {
        return JSON.parse(fs.readFileSync(DB_PATH));
    } catch (e) {
        return [];
    }
};

// 1. GET FEED
exports.getFeed = (req, res) => {
    // Return newest first
    const db = getDb();
    res.json(db.reverse());
};

// 2. ADD TOPIC
exports.addTopic = async (req, res) => {
    try {
        const { topic, category = 'tech' } = req.body;
        console.log(`🚀 API: Received '${topic}' [${category}]`);

        // Step A: Generate Content (Brain)
        const data = await factory.generateContent(topic, category);
        
        // Add metadata
        data.topic = topic;
        data.category = category;
        data.date = new Date().toISOString();

        // Step B: Ensure Folders Exist (Self-Healing)
        if (!fs.existsSync(FEED_DIR)) fs.mkdirSync(FEED_DIR, { recursive: true });
        
        const dataDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

        // Step C: Draw Image (Artist)
        const filename = `feed_${Date.now()}.png`;
        const filepath = path.join(FEED_DIR, filename);
        canvas.draw(data, filepath);

        // Step D: Save to DB
        const db = getDb();
        const entry = {
            filename: filename,
            category: category,
            topic: topic,
            title: data.title,
            date: data.date
        };
        db.push(entry);
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

        console.log("✅ API: Success");
        res.json({ success: true, message: 'Created', entry });

    } catch (error) {
        console.error("❌ API Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};