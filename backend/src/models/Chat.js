const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    enum: ['direct', 'group', 'channel'],
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['member', 'admin', 'moderator'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  avatar: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  },
  settings: {
    isPrivate: {
      type: Boolean,
      default: false
    },
    allowInvites: {
      type: Boolean,
      default: true
    },
    allowEditing: {
      type: Boolean,
      default: true
    },
    allowDeletion: {
      type: Boolean,
      default: true
    },
    slowMode: {
      type: Boolean,
      default: false
    },
    slowModeInterval: {
      type: Number,
      default: 0 // seconds
    }
  },
  pinnedMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    // For additional chat data
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for better query performance
chatSchema.index({ 'participants.user': 1 });
chatSchema.index({ type: 1 });
chatSchema.index({ lastMessageAt: -1 });
chatSchema.index({ name: 'text', description: 'text' });

// Virtual for participant count
chatSchema.virtual('participantCount').get(function() {
  return this.participants.filter(p => p.isActive).length;
});

// Method to add participant
chatSchema.methods.addParticipant = function(userId, role = 'member') {
  const existingParticipant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (!existingParticipant) {
    this.participants.push({
      user: userId,
      role: role
    });
    
    if (role === 'admin') {
      this.admins.push(userId);
    } else if (role === 'moderator') {
      this.moderators.push(userId);
    }
  }
  
  return this.save();
};

// Method to remove participant
chatSchema.methods.removeParticipant = function(userId) {
  this.participants = this.participants.filter(
    p => p.user.toString() !== userId.toString()
  );
  
  this.admins = this.admins.filter(
    admin => admin.toString() !== userId.toString()
  );
  
  this.moderators = this.moderators.filter(
    moderator => moderator.toString() !== userId.toString()
  );
  
  return this.save();
};

// Method to update participant role
chatSchema.methods.updateParticipantRole = function(userId, newRole) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.role = newRole;
    
    // Update admin/moderator lists
    this.admins = this.admins.filter(
      admin => admin.toString() !== userId.toString()
    );
    this.moderators = this.moderators.filter(
      moderator => moderator.toString() !== userId.toString()
    );
    
    if (newRole === 'admin') {
      this.admins.push(userId);
    } else if (newRole === 'moderator') {
      this.moderators.push(userId);
    }
  }
  
  return this.save();
};

// Method to increment unread count
chatSchema.methods.incrementUnreadCount = function(userId) {
  const currentCount = this.unreadCount.get(userId.toString()) || 0;
  this.unreadCount.set(userId.toString(), currentCount + 1);
  return this.save();
};

// Method to reset unread count
chatSchema.methods.resetUnreadCount = function(userId) {
  this.unreadCount.set(userId.toString(), 0);
  return this.save();
};

// Method to update last message
chatSchema.methods.updateLastMessage = function(messageId) {
  this.lastMessage = messageId;
  this.lastMessageAt = new Date();
  return this.save();
};

// Method to pin message
chatSchema.methods.pinMessage = function(messageId) {
  if (!this.pinnedMessages.includes(messageId)) {
    this.pinnedMessages.push(messageId);
  }
  return this.save();
};

// Method to unpin message
chatSchema.methods.unpinMessage = function(messageId) {
  this.pinnedMessages = this.pinnedMessages.filter(
    id => id.toString() !== messageId.toString()
  );
  return this.save();
};

// Get chat for API response
chatSchema.methods.toAPIResponse = function(userId) {
  const userParticipant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  return {
    _id: this._id,
    name: this.name,
    type: this.type,
    avatar: this.avatar,
    description: this.description,
    participantCount: this.participantCount,
    lastMessage: this.lastMessage,
    lastMessageAt: this.lastMessageAt,
    unreadCount: this.unreadCount.get(userId.toString()) || 0,
    userRole: userParticipant ? userParticipant.role : null,
    isAdmin: this.admins.some(admin => admin.toString() === userId.toString()),
    isModerator: this.moderators.some(mod => mod.toString() === userId.toString()),
    settings: this.settings,
    pinnedMessages: this.pinnedMessages,
    tags: this.tags,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('Chat', chatSchema);
