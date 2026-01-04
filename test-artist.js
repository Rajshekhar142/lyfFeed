const { draw } = require('./src/services/canvas');
const fs = require('fs');

// Ensure output folder exists
if (!fs.existsSync('./public/feed')) {
    fs.mkdirSync('./public/feed', { recursive: true });
}

// Mock Data (Simulating what Gemini sends)
const mockTech = {
    category: 'tech',
    title: 'Kubernetes Pods',
    intro: 'A Pod is the smallest execution unit in Kubernetes, representing a single instance of a running process in your cluster.',
    points: [
        'Containers share the same network IP.',
        'Pods are ephemeral and can die anytime.',
        'Usually managed by Deployments, not manually.'
    ]
};

const mockLit = {
    category: 'lit',
    title: 'The Abyss',
    intro: 'Nietzsche warns that gazing too long into the abyss allows the abyss to gaze back into you, symbolizing the danger of fighting monsters.',
    points: [
        'Beyond Good and Evil context.',
        'A warning against becoming what you hate.',
        'Maintaining humanity during struggle.'
    ]
};

console.log("🎨 Painting Tech...");
draw(mockTech, './public/feed/test_tech.png');

console.log("🎨 Painting Lit...");
draw(mockLit, './public/feed/test_lit.png');