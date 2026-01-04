const {createCanvas , registerFont} = require('canvas');
const fs = require('fs');

const STYLES = {
    tech:{
        bg: '#000000',           // Pure Black
        title: '#BB86FC',        // Neon Purple
        text: '#E0E0E0',         // Soft White
        accent: '#03DAC6',       // Teal for bullets
        fontTitle: 'bold 50px "Courier New"',
        fontBody: '28px "Courier New"'
    },
    lit:{
        bg: '#F5F5F7',           // Very Light Grey/Blue
        title: '#003366',        // Classic Deep Navy
        text: '#1D1D1F',         // Apple-style Black
        accent: '#C49428',       // Gold for bullets
        fontTitle: 'bold 50px "Times New Roman"',
        fontBody: '28px "Times New Roman"'
    }
};
const draw = (data, filepath)=>{
    // Select Style
    const style = STYLES[data.category] || STYLES.tech;

    // setup canvas square for feed
    const width = 800;
    const height = 800;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');


    // background
    ctx.fillStyle = style.bg;
    ctx.fillRect(0,0,width, height);

    // Margins
    const margin = 80;
    const maxWidth = width - (margin * 2);

    // title
    ctx.fillStyle = style.title;
    ctx.font = style.fontTitle;
    ctx.fillText(data.title , margin, 150);

    // intro wrapped
    ctx.fillStyle = style.text;
    ctx.font = style.fontBody;

    // we start drawing at y = 240
    let currentY = 240;
    currentY = wrapText(ctx, data.intro , margin , currentY , maxWidth , 40);

    // bullet points
    currentY += 60; // Add gap before points 
    const points = data.points || [];

    points.forEach(point => {
        ctx.fillStyle = style.accent;
        ctx.fillText('*' , margin - 30 , currentY);

        // Draw Text
        ctx.fillStyle = style.text;
        currentY = wrapText(ctx, point , margin , currentY , maxWidth , 40);

        currentY += 20;
    })

    // save file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);
    console.log(`Artist : Saved Img at ${filepath}`);
};

// --- HELPER: The Text Wrapper ---
// This calculates where to break lines so text fits inside the box
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    // Draw the last line
    ctx.fillText(line, x, y);
    return y + lineHeight; // Return new Y position for next element
}

module.exports = {draw};
