// scripts/test.js
const { spawn } = require('child_process');

const script = require.resolve('react-scripts/scripts/test');
const child = spawn('node', [script], { stdio: 'inherit' });
child.on('close', (code) => {
    process.exit(code);
});
