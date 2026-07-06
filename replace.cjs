const fs = require('fs');
let data = fs.readFileSync('src/NeanicSections.jsx', 'utf8');

// Replace colors
data = data.replace(/color:\s*["']#060e1c["']/g, 'color: "var(--color-text-primary)"');
data = data.replace(/color:\s*["']white["']/g, 'color: "var(--color-text-primary)"'); // Some things were explicitly white, wait, white might be needed for buttons.

// Let's be careful.
data = data.replace(/background:\s*["']rgba\(255,\s*255,\s*255,\s*0\.88\)["']/g, 'background: "var(--color-bg-white)"');
data = data.replace(/background:\s*["']rgba\(255,\s*255,\s*255,\s*0\.75\)["']/g, 'background: "var(--color-bg-white)"');
data = data.replace(/background:\s*["']white["']/g, 'background: "var(--color-bg-white)"');
data = data.replace(/background:\s*["']#f8fafd["']/g, 'background: "var(--color-bg-cream)"');
data = data.replace(/background:\s*["']#eef4fc["']/g, 'background: "var(--color-bg-blue-tint)"');
data = data.replace(/color:\s*["']#0055aa["']/g, 'color: "var(--color-primary)"');
data = data.replace(/color:\s*["']#6622bb["']/g, 'color: "var(--color-primary)"');
data = data.replace(/color:\s*["']#0077bb["']/g, 'color: "var(--color-primary)"');
data = data.replace(/color:\s*["']#0066cc["']/g, 'color: "var(--color-primary)"');

fs.writeFileSync('src/NeanicSections.jsx', data);
console.log("Done");
