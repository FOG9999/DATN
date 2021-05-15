const Message = require("../model/Message");
const Conversation = require("../model/Conversation");
const faker = require("faker");
const Seen = require("../model/Seen");
const User = require("../model/User");

module.exports = {
  createConversationSamples: async (done) => {
    const users = [
      "60818f784c61903d747326a9",
      "60812aefcdd2af4ba4d33287",
      "60750e42234bc4344011bcac",
    ];
    let conv1 = new Conversation({
      participants: [users[0], users[1]],
      last_message: null,
      last_changed: new Date().getTime(),
      name: faker.name.findName(),
    });
    let sevdConv1 = await conv1.save({ new: true });
    let seenUser1Conv1 = new Seen({
      user: users[0],
      conversation: sevdConv1._id,
      seen: true,
    });
    await seenUser1Conv1.save();
    let seenUser2Conv1 = new Seen({
      user: users[1],
      conversation: sevdConv1._id,
      seen: true,
    });
    await seenUser2Conv1.save();

    // conversation 2
    let conv2 = new Conversation({
      participants: [users[0], users[1], users[2]],
      last_message: null,
      last_changed: new Date().getTime(),
      name: faker.name.findName(),
    });
    let sevdConv2 = await conv2.save({ new: true });
    // user 1 conv 2
    let seenUser1Conv2 = new Seen({
      user: users[0],
      conversation: sevdConv2._id,
      seen: true,
    });
    await seenUser1Conv2.save();
    // user 2 conv 2
    let seenUser2Conv2 = new Seen({
      user: users[1],
      conversation: sevdConv2._id,
      seen: false,
    });
    await seenUser2Conv2.save();
    // user 3 conv 2
    let seenUser3Conv2 = new Seen({
      user: users[2],
      conversation: sevdConv2._id,
      seen: false,
    });
    await seenUser3Conv2.save();
    done({
      EC: 0,
      EM: "success",
    });
  },
  getUserConversations: async (user_id, done) => {
    try {
      let conversations = await Seen.find({ user: user_id }).populate(
        "conversation"
      );
      await Message.populate(conversations, {
        path: "conversation.last_message",
      });
      await User.populate(conversations, {
        path: "conversation.participants",
      });
      for (let i = 0; i < conversations.length; i++) {
        if (conversations[i].conversation.last_message) {
          let sender = await User.find({
            _id: conversations[i].conversation.last_message.sender,
          });
          conversations[i].conversation.last_message.sender = { ...sender };
        }
      }
      const output = [];
      conversations.forEach((conv) => {
        output.push({
          ...conv.conversation._doc,
          seen: conv.seen,
        });
      });
      done({
        EC: 0,
        EM: "success",
        data: {
          conversations: [...output],
        },
      });
    } catch (err) {
      done({
        EC: 500,
        EM: err.message,
      });
    }
  },
  createMessageSamples: async (done) => {
    const conID = "609e92e49831f13c486d03b7";
    const users = ["60818f784c61903d747326a9", "60812aefcdd2af4ba4d33287"];
    const files = ["608996f1b64d580768c85023", "608996f2b64d580768c85024"];
    for (let i = 0; i < 20; i++) {
      let newmsg = new Message({
        sender: users[Math.round(Math.random())],
        text: faker.random.words(Math.round(Math.random() * 6) + 1),
        file:
          Math.round(Math.random() * 100) % 10 === 0
            ? files[Math.round(Math.random())]
            : null,
        conversation: conID,
        created_at: new Date().getTime(),
      });
      await newmsg.save();
    }
    done({
      EC: 0,
      EM: "success",
    });
  },
  getMessagesInConversation: async (user_id, conID, page, pagesize, done) => {
    let messages = await Message.find({ conversation: conID })
      .populate("sender")
      .populate("file");
    let conversation = await Conversation.findOne({ _id: conID }).populate(
      "participants"
    );
    messages.sort((m1, m2) => m2.created_at - m1.created_at);
    messages = [...messages.slice((page - 1) * pagesize, page * pagesize)];
    let output = [];
    for (let i = 1; i < messages.length; i++) {
      if (messages[i].sender._id === messages[i - 1].sender._id) {
        output.push({
          ...messages[i]._doc,
          showAvatar: false,
        });
      } else {
        output.push({
          ...messages[i]._doc,
          showAvatar: true,
        });
      }
    }
    done({
      EC: 0,
      EM: "success",
      data: {
        messages: [...output],
        conversation: { ...conversation },
      },
    });
  },
};
