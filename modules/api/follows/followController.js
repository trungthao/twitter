const db = require('then-redis').createClient();

var addFollow = (followInfo) => {
  let promiseAddFollowing = db.sadd(`following:${followInfo.myUsername}`, followInfo.followUser);
  let promiseAddFollower = db.sadd(`follower:${followInfo.followUser}`, followInfo.myUsername);
  let promiesGetPostIdFollower = db.zrange(`post:${followInfo.followUser}`, '0', '-1', 'withscores');

  let iterator = [promiseAddFollowing, promiseAddFollower, promiesGetPostIdFollower];
  promiesGetPostIdFollower.then(replys => {
    console.log('promiesGetPostIdFollower');
    for(let i = 0; i < replys.length; i += 2) {
      let promise = db.zadd(`show_post:${followInfo.myUsername}`, replys[i+1], replys[i]);
      iterator.push(promise);
    }
  });

  return Promise.all(iterator);
}

module.exports = {
  addFollow
}
