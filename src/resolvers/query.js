module.exports = {
  notes: async (parent, args, { models }) => {
    return await models.Note.find().limit(50)
  },
  note: async (parent, args, { models }) =>  {
    return await models.Note.findById(args.id)
  },
  user: async (parent, { username }, { models }) =>  {
    // 주어진 username과 일치하는 사용자 찾기
    return await models.User.findOne({username});
  },
  users: async (parent, args, { models }) =>  {
    // 모든 사용자 찾기
    return await models.User.find({});
  },
  me: async (parent, args, { models, user }) =>  {
    // 현재 user context에 맞는 사용자 찾기
    return await models.User.findById(user.id);
  },
  noteFeed: async (parent, { cursor }, { models }) => {
    // limit를 10으로 하드코딩
    const limit = 10;
    let hasNextPage = false;
    let cursorQuery = {};

    // cursor가 있으면
    // 쿼리가 cursor 미만인 ObjectId를 가진 노트를 탐색
    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }

    // DB에서 limit  + 1개의 노트를 탐색하고 최신순으로 정렬
    let notes =  await models.Note.find(cursorQuery)
    .sort({ _id: -1 })
    .limit(limit + 1 )

    // 노트 개수가 limit를 초과하면 
    // hasNextpage를 true로 설정하고 notes를 limit까지 자름 
    if ( notes.length >  limit ) {
      hasNextPage = true;
      notes =  notes.slice(0,-1)
    }

    // 새 cursor는 피드 배열 마지막 항목의 몽고 객체 ID
    const newCursor =  notes[notes.length - 1]._id;

    return {
      notes,
      cursor: newCursor,
      hasNextPage
    };
  }
}