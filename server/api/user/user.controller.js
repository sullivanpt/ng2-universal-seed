'use strict';

/**
 * Get list of users (mocked)
 */
exports.index = function(req, res) {
  res.send({
    users: [
      { _id: 1, name: 'user1' },
      { _id: 2, name: 'user2' },
    ]
  });
};
