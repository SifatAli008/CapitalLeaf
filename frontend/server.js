const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Parse URL
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>404 - File Not Found</title></head>
                        <body>
                            <h1>404 - File Not Found</h1>
                            <p>The requested file ${req.url} was not found.</p>
                            <a href="/">Go back to home</a>
                        </body>
                    </html>
                `, 'utf-8');
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Frontend server running at http://localhost:${PORT}`);
    console.log(`📱 Zero Trust Authentication Interface ready!`);
    console.log(`🔗 Backend API should be running at http://localhost:3000`);
    console.log(`\n📋 Available endpoints:`);
    console.log(`   Frontend: http://localhost:${PORT}`);
    console.log(`   Backend API: http://localhost:3000/api`);
    console.log(`   Health Check: http://localhost:3000/health`);
    console.log(`\n🛡️  Zero Trust Access Control Features:`);
    console.log(`   ✅ Device Fingerprinting`);
    console.log(`   ✅ Behavioral Analysis`);
    console.log(`   ✅ Adaptive MFA`);
    console.log(`   ✅ Risk Assessment`);
    console.log(`   ✅ Security Dashboard`);
});
