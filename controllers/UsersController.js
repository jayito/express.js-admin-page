const bcrypt = require("bcrypt");
const BaseController = require("./BaseController");
const UserModel = require("../models/user");
const config = require("../config");

class UsersController extends BaseController {
  constructor() {
    super(UserModel);
  }

  verifyUser(username, password) {
    return this.fetchUserDetails({ username })
      .then(this.matchCredentials.bind(this, password));
  }

  matchCredentials(userPassword, resp) {
    return new Promise((resolve, reject) => {
      if (resp.password && bcrypt.compareSync(userPassword, resp.password)) {
        resolve(resp);
      } else {
        reject(false);
      }
    });
  }

  _processPayload(payload) {
    let user = new UserModel();
    for (const key in payload) {
      if (key === 'password') {
        user[key] = payload[key] ? bcrypt.hashSync(payload[key], config.security.bcryptRounds) :
          user[key];
      } else {
        user[key] = payload[key];
      }
    }
    return user;
  }

  createUser(payload) {
    const user = this._processPayload(payload);
    
    return user.save();
  }

}

module.exports = UsersController;