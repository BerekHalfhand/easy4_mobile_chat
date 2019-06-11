class Handlers {
  constructor ( io ) {
    this.config  = require('../config');
    this.response = require('./response');
    this.Message = require('./models/message.js');
    this.Chatroom = require('./models/chatroom.js');

    this.io = io;
  }

  sendMessage (msg, unresolve = false) {
    console.log('sendMessage', msg);
    return new Promise((resolve, reject) => {
      if (unresolve && msg.chatroom) {
        // this.unresolveChatroom(msg.chatroom)
      }
      let message = new this.Message(msg);

      message.save((err) => {
        console.log('saving');
        if (err) {
          reject(err);
          return;
        }

        this.io.emit('message', message);
        resolve(this.response.success(message));
          // reject(['err']);
          // return;
      })
    })
  }

  sendWelcomeMessage (chatroom) {
    console.log('sendWelcomeMessage for', chatroom);
    return sendMessage({
      chatroom,
      ...config.welcomeMessage
    })
  }

  resolveChatroom (name) {
    console.log('resolveChatroom', name);
    return new Promise((resolve, reject) => {
      this.Chatroom.findOne({name},(err, chatroom)=> {
        console.log('chatroom', chatroom);
        if (!chatroom) {
          reject(['Chatroom not found']);
          return;
        }

        chatroom.resolved = true;
        chatroom.save((err) => {
          if(err) {
            reject(err);
            return;
          } else {
            resolve(this.response.success(chatroom));
          }
        })

      })
    })
  }

  unresolveChatroom (name) {
    this.Chatroom.findOne({ name },(err, chatroom)=> {
      console.log('unresolving chatroom', chatroom);
      if (!chatroom) {
        // reject(['No chatroom found']);
        return false;
      }
      chatroom.resolved = false;
      chatroom.save((err) => {
        if(err) {
          // reject(err);
          return false;
        }
      })
    });
    return true;
  }

  // Route handlers

  getMessages () {
    return new Promise((resolve, reject) => {
      this.Message.find({},(err, messages)=> {
        resolve(this.response.success(messages));
      })
    })
  }

  getMessagesByChatroom (chatroom) {
    return new Promise((resolve, reject) => {
      this.Message.find({chatroom},(err, messages)=> {
        resolve(this.response.success(messages));
      })
    })
  }

  getUnresolvedChatrooms () {
    console.log('getUnresolvedChatrooms');
    return new Promise((resolve, reject) => {
      this.Chatroom.find({resolved: false},(err, chatrooms)=> {
        resolve(this.response.success(chatrooms));
      })
    })
  }

  getChatroom (body) {
    if (body.author) {
      body.participants = [body.author];
    }

    console.log('getChatroom', body);

    this.Chatroom.findOne({ name: body.name },(err, chatroom)=> {
      console.log('chatroom', chatroom);

      if (!chatroom) {
        let newChatroom = new this.Chatroom(body);

        newChatroom.save((err) => {
          if(err) {
            return this.response.failure(err);
          } else {
            console.log('newChatroom', newChatroom);
            handlers.sendWelcomeMessage(newChatroom.name);
            return this.response.success(newChatroom);
          }
        });
      } else {
        return this.response.success(chatroom);
      }
    });
  }
}

module.exports = ( io ) => { return new Handlers( io ) }
