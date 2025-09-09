const http = require('http');

console.log('🧪 Testing CapitalLeaf Servers...\n');

// Test backend server
function testBackend() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:3000/health', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('✅ Backend Server (Port 3000): RUNNING');
                    console.log(`   Status: ${response.status}`);
                    console.log(`   Components: ${Object.keys(response.components).length} active`);
                    resolve(true);
                } catch (e) {
                    console.log('❌ Backend Server (Port 3000): ERROR - Invalid response');
                    resolve(false);
                }
            });
        });
        
        req.on('error', () => {
            console.log('❌ Backend Server (Port 3000): NOT RUNNING');
            resolve(false);
        });
        
        req.setTimeout(3000, () => {
            console.log('❌ Backend Server (Port 3000): TIMEOUT');
            resolve(false);
        });
    });
}

// Test frontend server
function testFrontend() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:8080', (res) => {
            console.log('✅ Frontend Server (Port 8080): RUNNING');
            console.log(`   Status Code: ${res.statusCode}`);
            resolve(true);
        });
        
        req.on('error', () => {
            console.log('❌ Frontend Server (Port 8080): NOT RUNNING');
            resolve(false);
        });
        
        req.setTimeout(3000, () => {
            console.log('❌ Frontend Server (Port 8080): TIMEOUT');
            resolve(false);
        });
    });
}

// Run tests
async function runTests() {
    console.log('🔍 Checking server status...\n');
    
    const backendOk = await testBackend();
    const frontendOk = await testFrontend();
    
    console.log('\n📊 Test Results:');
    console.log(`   Backend: ${backendOk ? '✅ OK' : '❌ FAILED'}`);
    console.log(`   Frontend: ${frontendOk ? '✅ OK' : '❌ FAILED'}`);
    
    if (backendOk && frontendOk) {
        console.log('\n🎉 All servers are running successfully!');
        console.log('\n🔗 Access URLs:');
        console.log('   Frontend: http://localhost:8080');
        console.log('   Backend API: http://localhost:3000/api');
        console.log('   Health Check: http://localhost:3000/health');
        console.log('\n🛡️ Zero Trust Authentication is ready!');
    } else {
        console.log('\n⚠️ Some servers are not running. Please check the server windows.');
        console.log('\n💡 To start servers manually:');
        console.log('   Backend: npm start');
        console.log('   Frontend: cd frontend && node server.js');
    }
}

runTests();
