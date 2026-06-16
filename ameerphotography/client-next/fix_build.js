const fs = require('fs');
let file = './src/components/gallery/PhotoGallery.jsx';
let content = fs.readFileSync(file, 'utf8');
if(!content.includes('"use client"')) fs.writeFileSync(file, '"use client";\n' + content);

file = './src/context/AuthContext.jsx';
content = fs.readFileSync(file, 'utf8');
if(!content.includes('"use client"')) fs.writeFileSync(file, '"use client";\n' + content);

file = './src/components/booking/BookingForm.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/@\/components\/services\/bookingService/g, '@/services/bookingService');
fs.writeFileSync(file, content);

file = './src/app/globals.css';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/url\(\.\/assets\/fonts\//g, 'url(../assets/fonts/');
fs.writeFileSync(file, content);
console.log('Fixed client directives, services alias, and font paths.');
