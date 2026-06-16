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
  content = content.replace(/@\/common\//g, '@/components/common/');
  content = content.replace(/@\/layout\//g, '@/components/layout/');
  content = content.replace(/@\/home\//g, '@/components/home/');
  content = content.replace(/@\/gallery\//g, '@/components/gallery/');
  content = content.replace(/@\/booking\//g, '@/components/booking/');
  content = content.replace(/@\/admin\//g, '@/components/admin/');
  content = content.replace(/@\/reviews\//g, '@/components/reviews/');
  content = content.replace(/@\/about\//g, '@/components/about/');
  content = content.replace(/@\/services\//g, '@/components/services/');

  // Fix react-router-dom issue in contact page
  content = content.replace(/import\s+\{\s*useSearchParams\s*\}\s+from\s+['"]react-router-dom['"];/g, 'import { useSearchParams } from "next/navigation";');
  
  // Fix lucide-react missing icons issue
  content = content.replace(/import\s+\{\s*Instagram\s*,\s*Facebook\s*([^}]*)\}\s+from\s+['"]lucide-react['"];/g, 'import { $1 } from "lucide-react";\nimport { FaInstagram, FaFacebook } from "react-icons/fa";');
  content = content.replace(/<Instagram/g, '<FaInstagram');
  content = content.replace(/<Facebook/g, '<FaFacebook');

  if(content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
