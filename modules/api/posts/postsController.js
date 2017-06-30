const time = require('../../utilities/time'),
  db = require('../../utilities/redisClient').databaseClient;

var addPost = (postInfo) => {
  // increment id of the post
  let promiseIncr = addPostUsername = db.incr('next_post_id');

  // add id to post:username
  let promiseAddPostUser = promiseIncr.then(post_id => {
    return db.zadd(`post:${postInfo.username}`, postInfo.timePost, post_id);
  });

  // add id to all_post
  let promiseAddAllPost = promiseIncr.then(post_id => {
    return db.zadd('all_post', postInfo.timePost, post_id);
  });

  // add content to post_content:post_id
  let promiseAddPost = promiseIncr.then(post_id => {
    return db.hmset('post_content:' + post_id, 'username', postInfo.username, 'content', postInfo.content);
  })

  let iterator = [promiseIncr, promiseAddPostUser, promiseAddAllPost, promiseAddPost];

  // add post_id to all user follow me
  let promseGetMemberFollower = db.smembers(`follower:${postInfo.username}`);
  promseGetMemberFollower.then(members => {
    members.forEach(member => {
      console.log(member);
      let promise = promiseIncr.then(post_id => {
        return db.zadd(`show_post:${member}`, postInfo.timePost, post_id);
      });
      iterator.push(promise);
    });
  });

  return Promise.all(iterator);
}

var getShowPost = (username) => {
  // get id of all post will show
    let promiseShowPost = db.zrange(`show_post:${username}`, 0, -1, 'withscores');
    return getListPostsFromListId(promiseShowPost);
}

var getAllPost = () => {
  let promiseShowAll = db.zrange('all_post', 0, -1, 'withscores');
  return getListPostsFromListId(promiseShowAll);
}

var getListPostsFromListId = (promise) => {
  let listPromises = [];
    return promise.then(listPosts => {
      for(let i = 0; i < listPosts.length; i += 2) {
        let promise = db.hvals(`post_content:${listPosts[i]}`).then(values => {
          postContent = {
            username: values[0],
            content: values[1],
            timePost: time.convertTime(listPosts[i+1])
          }
          return Promise.resolve(postContent);
        });
        listPromises.push(promise);
      }
      return Promise.all(listPromises)
    })
    .catch(reason => {
      return Promise.reject('zrange:' + reason);
    });
}

module.exports = {
  addPost,
  getShowPost,
  getAllPost
}
