const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  if(!file.endsWith('.jsx') && !file.endsWith('.js')) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/import\s+\{\s*Helmet\s*\}\s+from\s+['"]react-helmet-async['"];?/g, '');
  content = content.replace(/<Helmet>[\s\S]*?<\/Helmet>/g, '');
  if(content !== original) {
    fs.writeFileSync(file, content);
    console.log('Stripped Helmet from', file);
  }
});
