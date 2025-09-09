# 🚀 How to Run the CapitalLeaf Backend Server

## Quick Start (Demo Mode - No Database Required)

### Option 1: Run the Test Server (Recommended for Demo)

1. **Open Command Prompt or PowerShell** in the project directory:
   ```bash
   cd E:\CapitalLeaf
   ```

2. **Run the test server**:
   ```bash
   node test-server.js
   ```

3. **You should see output like**:
   ```
   🛡️  CapitalLeaf Security Framework running on port 3000
   🔒 Dynamic Defense with Microservice Isolation active
   📊 Behavior-Driven Protection enabled
   🎯 Live Threat Intelligence monitoring
   🚀 Demo mode - No database required
   ```

4. **Test the server** by opening your browser and going to:
   - `http://localhost:3000` - Main endpoint
   - `http://localhost:3000/health` - Health check

### Option 2: Run the Full Server (Requires MongoDB)

If you have MongoDB installed:

1. **Install MongoDB** (if not already installed):
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

2. **Start MongoDB**:
   ```bash
   mongod
   ```

3. **Uncomment the database connection** in `src/index.js`:
   ```javascript
   // Change this line:
   // connectDB();
   // To this:
   connectDB();
   ```

4. **Run the full server**:
   ```bash
   node src/index.js
   ```

## 🧪 Testing the API Endpoints

### Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "SecurePass123!"
  }'
```

### Test Health Check
```bash
curl http://localhost:3000/health
```

## 🌐 Frontend Integration

Your frontend is already configured to work with these endpoints:

1. **Registration**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login`
3. **Health Check**: `GET /health`

The frontend will automatically connect to `http://localhost:3000` when running locally.

## 🔧 Troubleshooting

### Port Already in Use
If you get "EADDRINUSE" error:
```bash
# Kill any existing Node processes
taskkill /f /im node.exe

# Or change the port in the server file
# Set PORT=3001 in your environment
```

### Server Not Starting
1. Check if Node.js is installed: `node --version`
2. Check if dependencies are installed: `npm install`
3. Check for syntax errors: `node -c test-server.js`

### Database Connection Issues
- Use the test server (`test-server.js`) for demo purposes
- Install MongoDB locally or use MongoDB Atlas
- Check your `.env` file for correct `MONGODB_URI`

## 📱 Frontend Testing

Once the backend is running:

1. **Start your frontend** (in a separate terminal):
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open your browser** to `http://localhost:3000` (or the port shown by Next.js)

3. **Test the registration and login flows**

## 🎯 What's Working

### ✅ Demo Mode Features:
- User registration (accepts any valid data)
- User login (accepts any username/password)
- JWT token generation
- Risk assessment simulation
- Device fingerprinting simulation
- Input validation
- Error handling
- CORS enabled
- Security headers

### 🔄 Full Mode Features (with MongoDB):
- Persistent user storage
- Password hashing
- Account lockout protection
- Device management
- Session tracking
- User profile management
- Password change functionality

## 🚀 Next Steps

1. **Test the basic functionality** with the demo server
2. **Set up MongoDB** for full functionality
3. **Configure environment variables** in `.env`
4. **Test with your frontend**
5. **Deploy to production** when ready

## 📞 Need Help?

If you encounter issues:
1. Check the console output for error messages
2. Verify all dependencies are installed: `npm install`
3. Make sure port 3000 is available
4. Check the troubleshooting section above

The server is ready to run! 🎉
