import fs from 'fs';

export function readJSON(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  if (!raw.trim()) {
    return [];
  }

  return JSON.parse(raw);
}

export function writeJSON(filePath, data) {
  const tempPath = `${filePath}.tmp`;
  const payload = JSON.stringify(data, null, 2);

  // Write to a temp file first, then rename for simple atomic persistence.
  fs.writeFileSync(tempPath, payload, 'utf-8');
  fs.renameSync(tempPath, filePath);
}
