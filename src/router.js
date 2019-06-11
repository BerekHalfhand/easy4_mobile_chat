module.exports = (io) => {
  const express = require('express');
  const router = express.Router();
  const handlers = require('./handlers')(io);
  const response = require('./response');
  const bodyParser =  require('body-parser');

  // middleware that is specific to this router
  router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now(), req.url)
    next()
  })

  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: false }));

  // GET

  router.get(`/`, (req, res) => {
    res.sendFile('index.html' , { root : __dirname});
  })

  router.get(`/messages`, async (req, res) => {
    let result = await handlers.getMessages();
    res.send(result);
  })

  router.get(`/messages/:chatroom`, async (req, res) => {
    const chatroom = req.params.chatroom;

    let result = await handlers.getMessagesByChatroom(chatroom);
    res.send(result);
  })

  router.get(`/chatrooms/unresolved`, async (req, res) => {
    let result = await handlers.getUnresolvedChatrooms();
    res.send(result);
  })

  // POST

  router.post(`/chatrooms`, async (req, res) => {
    let { body } = req;
    if (!body) {
      return res.status(500).send(response.failure(['No params']));
    }

    let result = await handlers.getChatroom(body);
    res.send(result);
  });

  router.post(`/messages`, async (req, res) => {
    let { body } = req;
    if (!body) {
      return res.status(500).send(response.failure(['No params']));
    }

    // let result = await handlers.sendMessage(body, true);
    // res.send(result);
    handlers.sendMessage(body, true)
      .then(result => res.send(result))
      .catch(err => res.status(500).send(response.failure(err)))
  });

  router.post(`/chatrooms/unresolved`, async (req, res) => {
    let { body } = req;
    if (!body || !body.chatroom) {
      return res.status(500).send(response.failure(['No params']));
    }

    let result = await handlers.resolveChatroom(body.chatroom);
    res.send(result);
  })

  return router;
};
