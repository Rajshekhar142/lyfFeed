const { generateContent } = require('./src/services/factory');

async function test() {
    console.log("Testing Tech...");
    const tech = await generateContent("Docker", "tech");
    console.log(tech);

    console.log("\nTesting Lit...");
    const lit = await generateContent("Stoicism", "lit");
    console.log(lit);
}

test();