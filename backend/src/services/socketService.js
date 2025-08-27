const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Store online users
const onlineUsers = new Map();
const typingUsers = new Map();

const setupSocketHandlers = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`🔌 User connected: ${socket.user.username} (${socket.userId})`);

    // Add user to online users
    onlineUsers.set(socket.userId.toString(), {
      socketId: socket.id,
      user: socket.user,
      lastSeen: new Date()
    });

    // Update user status to online
    await socket.user.updateLastSeen();
    socket.user.isOnline = true;
    socket.user.status = 'online';
    await socket.user.save();

    // Join user's chats
    const userChats = await Chat.find({
      'participants.user': socket.userId
    });
    
    userChats.forEach(chat => {
      socket.join(chat._id.toString());
    });

    // Emit user online status to all connected users
    socket.broadcast.emit('user:online', {
      userId: socket.userId,
      username: socket.user.username,
      avatar: socket.user.avatar
    });

    // Send online users list to the connected user
    const onlineUsersList = Array.from(onlineUsers.values()).map(user => ({
      userId: user.user._id,
      username: user.user.username,
      avatar: user.user.avatar
    }));
    socket.emit('users:online', onlineUsersList);

    // Handle joining a chat
    socket.on('chat:join', async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (chat && chat.participants.some(p => p.user.toString() === socket.userId.toString())) {
          socket.join(chatId);
          socket.emit('chat:joined', { chatId });
          
          // Reset unread count
          await chat.resetUnreadCount(socket.userId);
          
          console.log(`📱 User ${socket.user.username} joined chat: ${chat.name || chatId}`);
        }
      } catch (error) {
        console.error('Error joining chat:', error);
      }
    });

    // Handle leaving a chat
    socket.on('chat:leave', (chatId) => {
      socket.leave(chatId);
      socket.emit('chat:left', { chatId });
      console.log(`📱 User ${socket.user.username} left chat: ${chatId}`);
    });

    // Handle sending messages
    socket.on('message:send', async (data) => {
      try {
        const { chatId, content, messageType = 'text', replyTo, fileUrl, fileName, fileSize } = data;

        // Validate chat access
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.some(p => p.user.toString() === socket.userId.toString())) {
          socket.emit('error', { message: 'Access denied to this chat' });
          return;
        }

        // Create new message
        const message = new Message({
          sender: socket.userId,
          chat: chatId,
          content,
          messageType,
          replyTo,
          fileUrl,
          fileName,
          fileSize
        });

        await message.save();

        // Update chat's last message
        await chat.updateLastMessage(message._id);

        // Increment unread count for other participants
        chat.participants.forEach(participant => {
          if (participant.user.toString() !== socket.userId.toString()) {
            chat.incrementUnreadCount(participant.user);
          }
        });

        // Populate sender info for response
        await message.populate('sender', 'username avatar');

        const messageData = {
          _id: message._id,
          sender: {
            _id: message.sender._id,
            username: message.sender.username,
            avatar: message.sender.avatar
          },
          content: message.content,
          messageType: message.messageType,
          fileUrl: message.fileUrl,
          fileName: message.fileName,
          fileSize: message.fileSize,
          replyTo: message.replyTo,
          createdAt: message.createdAt,
          status: 'sent'
        };

        // Emit to all users in the chat
        io.to(chatId).emit('message:received', messageData);

        console.log(`💬 Message sent in chat ${chatId}: ${content.substring(0, 50)}...`);

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing:start', async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (chat && chat.participants.some(p => p.user.toString() === socket.userId.toString())) {
          socket.to(chatId).emit('typing:started', {
            chatId,
            userId: socket.userId,
            username: socket.user.username
          });
        }
      } catch (error) {
        console.error('Error handling typing start:', error);
      }
    });

    socket.on('typing:stop', async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (chat && chat.participants.some(p => p.user.toString() === socket.userId.toString())) {
          socket.to(chatId).emit('typing:stopped', {
            chatId,
            userId: socket.userId
          });
        }
      } catch (error) {
        console.error('Error handling typing stop:', error);
      }
    });

    // Handle message reactions
    socket.on('message:react', async (data) => {
      try {
        const { messageId, emoji } = data;
        
        const message = await Message.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        // Check if user has access to the message
        const chat = await Chat.findById(message.chat);
        if (!chat || !chat.participants.some(p => p.user.toString() === socket.userId.toString())) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        await message.addReaction(socket.userId, emoji);
        await message.populate('reactions.user', 'username avatar');

        io.to(message.chat.toString()).emit('message:reaction', {
          messageId,
          reactions: message.reactions
        });

      } catch (error) {
        console.error('Error adding reaction:', error);
        socket.emit('error', { message: 'Failed to add reaction' });
      }
    });

    // Handle message read receipts
    socket.on('message:read', async (messageId) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        await message.markAsRead(socket.userId);
        
        io.to(message.chat.toString()).emit('message:read', {
          messageId,
          readBy: socket.userId
        });

      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle user status updates
    socket.on('user:status', async (status) => {
      try {
        socket.user.status = status;
        await socket.user.save();

        socket.broadcast.emit('user:status:updated', {
          userId: socket.userId,
          status: status
        });

      } catch (error) {
        console.error('Error updating user status:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`🔌 User disconnected: ${socket.user.username} (${socket.userId})`);

      // Remove from online users
      onlineUsers.delete(socket.userId.toString());

      // Update user status to offline
      socket.user.isOnline = false;
      socket.user.status = 'offline';
      await socket.user.save();

      // Emit user offline status
      socket.broadcast.emit('user:offline', {
        userId: socket.userId,
        username: socket.user.username
      });

      // Stop typing in all chats
      const userTyping = typingUsers.get(socket.userId.toString());
      if (userTyping) {
        userTyping.forEach(chatId => {
          socket.to(chatId).emit('typing:stopped', {
            chatId,
            userId: socket.userId
          });
        });
        typingUsers.delete(socket.userId.toString());
      }
    });
  });

  return io;
};

module.exports = { setupSocketHandlers, onlineUsers, typingUsers };
