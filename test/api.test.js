const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../src/app'); // We import the app, not the server

// --- MOCKING THE BRAIN ---
// We don't want to actually call Google Gemini every time we test.
// We just pretend it worked.
jest.mock('../src/services/factory', () => ({
    generateContent: jest.fn(async (topic, category) => {
        return {
            title: `Test Title for ${topic}`,
            intro: `Test Intro for ${category}`,
            points: ["Point A", "Point B", "Point C"]
        };
    })
}));

// --- CLEANUP ---
// Before tests start, clear the test data so we start fresh
const DB_PATH = path.join(__dirname, '../data/db.json');
const FEED_DIR = path.join(__dirname, '../public/feed');

beforeAll(() => {
    // Create folders if missing
    if (!fs.existsSync(path.dirname(DB_PATH))) fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    if (!fs.existsSync(FEED_DIR)) fs.mkdirSync(FEED_DIR, { recursive: true });
    
    // Reset DB
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
});

afterAll(() => {
    // Optional: Clean up created images after test
    // fs.rmSync(FEED_DIR, { recursive: true, force: true });
});

// --- THE TESTS ---

describe('LifeFeed API', () => {
    
    test('GET / should return health message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Phoenix');
    });

    test('POST /add should create a Tech post', async () => {
        const res = await request(app).post('/add').send({
            topic: 'Jest Testing',
            category: 'tech'
        });

        // 1. Check Response
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.entry.category).toBe('tech');

        // 2. Check Database
        const db = JSON.parse(fs.readFileSync(DB_PATH));
        expect(db.length).toBe(1);
        expect(db[0].topic).toBe('Jest Testing');

        // 3. Check Image File
        const filename = res.body.entry.filename;
        const filepath = path.join(FEED_DIR, filename);
        expect(fs.existsSync(filepath)).toBe(true);
    });

    test('POST /add should create a Lit post', async () => {
        const res = await request(app).post('/add').send({
            topic: 'Marcus Aurelius',
            category: 'lit'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.entry.category).toBe('lit');
    });

    test('GET /feed should return the list', async () => {
        const res = await request(app).get('/feed');
        
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2); // We added 2 items above
        // Should be reversed (newest first)
        expect(res.body[0].category).toBe('lit');
    });
});