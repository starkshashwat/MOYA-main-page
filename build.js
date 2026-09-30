const fs = require('node:fs');
const path = require('node:path');
const files = require('./public-files');
const root = __dirname;

function build() {
  // Validate all inputs before replacing generated output. A missing file fails the build.
  for (const file of files) {
    if (!fs.statSync(path.join(root, file)).isFile()) throw new Error(`Missing public file: ${file}`);
  }
  const stage = fs.mkdtempSync(path.join(root, '.build-'));
  try {
    for (const file of files) {
      const target = path.join(stage, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, file), target);
    }
    fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });
    fs.renameSync(stage, path.join(root, 'dist'));
    console.log(`Built ${files.length} public files into dist/.`);
  } finally {
    fs.rmSync(stage, { recursive: true, force: true });
  }
}

if (require.main === module) build();
module.exports = build;
