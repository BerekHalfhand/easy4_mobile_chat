const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  roles: {
    type: Array,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model(
  `${config.mongo.collectionPrefix}User`,
  userSchema,
);

module.exports = UserModel;
