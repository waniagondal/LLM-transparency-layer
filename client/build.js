const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['main.js'], // main entry point file in frontend/
    bundle: true,
    minify: false, // set true for production
    sourcemap: true,
    outfile: 'content.js', // output file in the same folder, which manifest references
    target: ['chrome58', 'firefox57', 'safari11'], // browser targets
    platform: 'browser',
}).catch(() => process.exit(1));
