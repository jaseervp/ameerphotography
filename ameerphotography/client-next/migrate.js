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
      if(file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src/app');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace react-router-dom imports
  content = content.replace(/import\s*\{([^}]+)\}\s*from\s*['"]react-router-dom['"];/g, (match, imports) => {
    let res = '';
    const hasNavigate = imports.includes('useNavigate');
    const hasLocation = imports.includes('useLocation');
    const hasLink = imports.includes('Link');
    const hasNavLink = imports.includes('NavLink');
    const hasNavigateComp = imports.includes('Navigate');
    
    if (hasNavigate || hasLocation) {
      let navImports = [];
      if (hasNavigate) navImports.push('useRouter');
      if (hasLocation) navImports.push('usePathname');
      res += `import { ${navImports.join(', ')} } from 'next/navigation';\n`;
    }
    
    if (hasLink || hasNavLink) {
      res += `import Link from 'next/link';\n`;
    }
    
    if (hasNavigateComp) {
      res += `import { redirect } from 'next/navigation';\n`;
    }
    
    return res.trim() ? res : match;
  });

  // Replace hooks usage
  content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\);/g, 'const router = useRouter();');
  content = content.replace(/navigate\(/g, 'router.push(');
  content = content.replace(/const\s+location\s*=\s*useLocation\(\);/g, 'const pathname = usePathname();');
  content = content.replace(/location\.pathname/g, 'pathname');
  content = content.replace(/<Navigate\s+to=/g, '<redirect href='); // Redirect might need manual handling, but this is a placeholder

  // Replace Link components
  content = content.replace(/<Link\s+to=/g, '<Link href=');
  content = content.replace(/<NavLink([^>]*)to=/g, '<Link$1href=');
  content = content.replace(/<\/NavLink>/g, '</Link>');

  if (content !== original) {
    if(!content.includes('"use client"') && !content.includes("'use client'")) {
      content = '"use client";\n' + content;
    }
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
