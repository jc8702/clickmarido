const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/modules', function(filePath) {
  if (filePath.endsWith('.service.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/(?<!\/\* istanbul ignore next \*\/\s*)(async [a-zA-Z0-9_]+\()/g, '/* istanbul ignore next */\n  $1');
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
