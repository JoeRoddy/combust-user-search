const admin = require("firebase-admin");

const users = {};

const usersRef = admin.database().ref("users");
usersRef.on("child_added", snap => {
  users[snap.key] = snap.val();
});
usersRef.on("child_changed", snap => {
  users[snap.key] = snap.val();
});
usersRef.on("child_removed", snap => delete users[snap.key]);

const searchByField = (query, field) => {
  if (!query || !field || !users) {
    return {};
  }
  const results = {};
  Object.keys(users).forEach(uid => {
    const user = users[uid].publicInfo;
    const val = user[field];
    if (
      val &&
      typeof val === "string" &&
      user[field].toUpperCase().includes(query.toUpperCase())
    ) {
      results[uid] = user;
    } else if (val && val.toString() === query) {
      results[uid] = user;
    }
  });
  return results;
};

module.exports = {
  getUsers: () => users,
  userSearch: (request, response) => {
    const { query, field } = request.query;
    const results = searchByField(query, field);
    response.send(results);
  }
};
