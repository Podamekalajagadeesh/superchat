# 🚀 Superchat Backend

Real-time messaging backend server with WebSocket support and Web3 integration.

## 🏗️ **Architecture**

```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Route controllers (coming soon)
│   ├── middleware/      # Authentication and validation
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic (Socket.io)
│   └── server.js        # Main server file
├── package.json
└── README.md
```

## 🚀 **Features**

### ✅ **Implemented**
- **Real-time Messaging**: WebSocket-based instant messaging
- **User Authentication**: JWT-based auth with email/password and wallet
- **Database Models**: User, Message, Chat schemas with relationships
- **Security**: Rate limiting, CORS, Helmet protection
- **Online Status**: Real-time user presence tracking
- **Typing Indicators**: Live typing status in chats
- **Message Reactions**: Emoji reactions on messages
- **Read Receipts**: Message delivery and read status

### 🚧 **Coming Soon**
- File uploads and media sharing
- Group chat management
- Message search and filtering
- Push notifications
- End-to-end encryption
- Web3 token integration

## 🛠️ **Tech Stack**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **Authentication**: JWT + bcrypt
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## 📦 **Installation**

1. **Clone and navigate to backend**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB** (if running locally)
```bash
# Install MongoDB or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## 🔧 **Configuration**

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/superchat

# Security
JWT_SECRET=your-super-secret-jwt-key

# CORS
FRONTEND_URL=http://localhost:3000
```

## 📡 **API Endpoints**

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/wallet-login` - Wallet-based login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/profile` - Update profile

### Health Check
- `GET /health` - Server health status

## 🔌 **WebSocket Events**

### Client → Server
- `chat:join` - Join a chat room
- `chat:leave` - Leave a chat room
- `message:send` - Send a message
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator
- `message:react` - Add reaction to message
- `message:read` - Mark message as read
- `user:status` - Update user status

### Server → Client
- `message:received` - New message received
- `typing:started` - User started typing
- `typing:stopped` - User stopped typing
- `message:reaction` - Message reaction updated
- `message:read` - Message read receipt
- `user:online` - User came online
- `user:offline` - User went offline
- `users:online` - List of online users

## 🗄️ **Database Models**

### User
- Authentication (email/password, wallet)
- Profile (username, avatar, status)
- Settings (notifications, privacy, theme)
- Relationships (friends, blocked users)
- Web3 integration (tokens, verification)

### Message
- Content and metadata
- File attachments
- Reactions and read receipts
- Reply threading
- Soft deletion

### Chat
- Direct, group, and channel types
- Participant management
- Admin/moderator roles
- Settings and permissions
- Pinned messages

## 🔒 **Security Features**

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent abuse
- **CORS Protection**: Cross-origin security
- **Input Validation**: Joi schema validation
- **Helmet**: Security headers
- **Error Handling**: Graceful error responses

## 🧪 **Testing**

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 **Deployment**

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 **Monitoring**

- **Health Check**: `GET /health`
- **Logging**: Console and file logging
- **Error Tracking**: Structured error responses
- **Performance**: Request timing and metrics

## 🔄 **Development Workflow**

1. **Feature Branch**: Create feature branch
2. **Code**: Implement with tests
3. **Test**: Run tests and linting
4. **Review**: Code review and approval
5. **Merge**: Merge to main branch
6. **Deploy**: Deploy to staging/production

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## 📄 **License**

MIT License - see LICENSE file for details

---

**Status**: ✅ **Backend Foundation Complete**  
**Next**: 🚀 **Connect Frontend to Backend**  
**Target**: **Real-time Messaging Live** 🎯
