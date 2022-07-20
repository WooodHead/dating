export default class ChatMessage {
  constructor(message, targetUserId = null, profile = {}) {
    this.targetUserId = targetUserId;
    this.profile = { ...profile };
    this.message = { ...message };
    this.messageDefault = {
      _id: '',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam quis mi libero. Phasellus quis vestibulum orci.',
      createdAt: null,
      isRead: false,
      toUser: '', // userId
      chatLink: '',
      avatarPath: '',
      type: 'own' // 'opposite'
    };
  }
  
  getTypeMsg(type) {
    return this.targetUserId === type ? 'own' : 'opposite';
  }
  
  getAuthorMsg(type) {
    return this.targetUserId === type ? {} : { ...this.profile };
  }
  
  setNewMessage() {
    return {
      ...this.messageDefault,
      ...this.message,
    };
  }
  
  getMessage() {
    const {
      __v,
      updatedAt,
      chatLink,
      type,
      toUser,
      ...data
    } = this.message;
    
    return {
      ...this.messageDefault,
      ...data,
      type: this.getTypeMsg(toUser),
      author: this.getAuthorMsg(toUser),
    };
  }
}
