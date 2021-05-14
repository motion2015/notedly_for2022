module.exports = {
  // 요청 받으면 user의 notes 목록 정보를 resolve
  notes: async (user, args, { models }) => {
    return await models.Note.find({ author: user._id}).sort({ _id: -1 })
  },
  // 요청 받으면 user의 favoritedBy 목록 정보를 resolve
  favorites: async (user, args, { models }) => {
    return await models.Note.find({ favoritedBy: user._id }).sort({ _id: -1 });
  }
}