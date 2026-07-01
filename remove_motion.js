const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove import { motion... } from 'motion/react'
      content = content.replace(/import\s*{[^}]*motion[^}]*}\s*from\s*["']motion\/react["'];?\n?/g, '');
      content = content.replace(/import\s*{[^}]*AnimatePresence[^}]*}\s*from\s*["']motion\/react["'];?\n?/g, '');
      content = content.replace(/import\s*{[^}]*}\s*from\s*["']motion\/react["'];?\n?/g, '');
      
      // Remove <AnimatePresence> and </AnimatePresence>
      content = content.replace(/<AnimatePresence[^>]*>/g, '');
      content = content.replace(/<\/AnimatePresence>/g, '');

      // Replace <motion.div to <div
      content = content.replace(/<motion\.([a-zA-Z]+)/g, '<$1');
      content = content.replace(/<\/motion\.([a-zA-Z]+)>/g, '</$1>');

      // We need to carefully remove props: initial={...}, animate={...}, exit={...}, transition={...}, layoutId="..."
      // Since they can span multiple lines, we can use a regex that balances braces, but regex can't easily balance.
      // However, most of them are single-line or simple. Let's try a regex that matches `prop={{...}}` or `prop={...}` 
      // without capturing closing tags.
      const propsToRemove = ['initial', 'animate', 'exit', 'transition', 'layoutId', 'layout'];
      for (const prop of propsToRemove) {
        // Regex to match ` prop={{ ... }}` or ` prop={ ... }` or ` prop=".."` across newlines sparingly
        // This is tricky. Let's just do a simpler approach:
        // Match `prop={` followed by anything non-greedy until `}` then maybe `}`
        const regex = new RegExp(`\\s*${prop}={(?:{[^}]*}|[^}])*}\\s*`, 'g');
        content = content.replace(regex, ' ');
        const regexString = new RegExp(`\\s*${prop}=["'][^"']*["']\\s*`, 'g');
        content = content.replace(regexString, ' ');
        const regexBool = new RegExp(`\\s*${prop}\\s*`, 'g');
        // Actually boolean `layout` is just `layout`
        if (prop === 'layout') {
             content = content.replace(/\slayout(\s|>)/g, '$1');
        }
      }

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('./src');
console.log("Done");
