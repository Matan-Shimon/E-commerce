// scripts/build.js
const { spawn } = require('child_process');

const script = require.resolve('react-scripts/scripts/build');
const child = spawn('node', [script], { stdio: 'inherit' });
child.on('close', (code) => {
    process.exit(code);
});
