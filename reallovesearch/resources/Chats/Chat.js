import { formattedDateForChat } from "utils/preps";

export default class Chat {
  constructor(chat) {
    this.chat = { ...chat };
    this.chatDefault = {
      _id: 0,
      chatLink: '',
      unreadMessagesCount: 0,
      profile: {
        avatarPath: '',
        name: 'Kate Johnsons',
        online: false
      },
      lastMessage: {
        _id: 0,
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam quis mi libero. Phasellus quis vestibulum orci.',
        createdAt: +new Date() - Math.random() * 1000000000,
        isRead: false,
        toUser: '',
      },
      config: {
        isArchived: false,
        isMute: false,
      },
    };
  }
  
  getChat() {
    const {
      lastMessage,
      unreadMessageCount,
      ...data
    } = this.chat;
    
    return {
      ...this.chatDefault,
      ...data,
      unreadMessagesCount: unreadMessageCount || 0,
      lastMessage: lastMessage ? {
        ...lastMessage,
        createdAt: formattedDateForChat(lastMessage.createdAt),
      } : this.chatDefault.lastMessage,
    };
  }
}
