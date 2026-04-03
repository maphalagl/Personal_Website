const fs = require('fs');
try {
    const img = fs.readFileSync('images/Lutendo.jpg');
    const b64 = img.toString('base64');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <clipPath id="circle">
      <circle cx="50" cy="50" r="50" />
    </clipPath>
  </defs>
  <image width="100" height="100" href="data:image/jpeg;base64,${b64}" clip-path="url(#circle)" preserveAspectRatio="xMidYMid slice" />
</svg>`;
    fs.writeFileSync('favicon.svg', svg);
    console.log('Successfully created base64 SVG');
} catch (e) {
    console.error('Error:', e);
}
