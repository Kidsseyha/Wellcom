const fs = require('fs');
let content = fs.readFileSync('src/lib/firebaseServices.ts', 'utf-8');

// Strip out firestore imports
content = content.replace(/import \{.*\} from 'firebase\/firestore';/, '');
content = content.replace(/import \{ app \} from '\.\/firebase';/, '');

// Just overwrite the file completely? It's easier.
