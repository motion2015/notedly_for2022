const mongoose  = require('mongoose');
const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express');

require('dotenv').config()
const gravatar =  require('../util/gravatar');

module.exports = {
  newNote: async (parent, args, { models, user }) => {
    if(!user){
      throw new AuthenticationError('You must be signed in to create a note')
    }
    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id)
    });
  },
  deleteNote: async (parent, { id }, { models, user }) => {
    if(!user){
      throw new AuthenticationError('You must be signed in to delete a note')
    }
    // note 찾기
    const note =  await models.Note.findById(id);
    if (note && String(note.author) !==  user.id) {
      throw new AuthenticationError("You don't have permissions to delete the note")
    }
    try {
      await models.Note.remove();
      return true;
    } catch (err) {
      return false
    }
  },
  updateNote: async (parent, { content, id }, { models, user }) => {
    if(!user){
      throw new AuthenticationError('You must be signed in to update a note')
    }
    // note 찾기
    const note =  await models.Note.findById(id);
    if (note && String(note.author) !==  user.id) {
      throw new AuthenticationError("You don't have permissions to update the note")
    }
    return await models.Note.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          content
        }
      },
      {
        new: true
      }
    )
  },
  signUp: async (parent, { username, email, password }, { models }) => {
    email =  email.trim().toLowerCase()
    const hashed =  await bcrypt.hash(password, 10)
    const avatar =  gravatar(email);
    try {
      const user =  await models.User.create({
        username,
        email,
        avatar,
        password: hashed
      });

      return jwt.sign({ id: user._id}, process.env.JWT_SECRET)
    } catch (err) {
      console.log(err);
      throw new Error('Error creating accunt')
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) {
      email =  email.trim().toLowerCase()
    }

    const user =  await models.User.findOne({
      $or: [{ email }, { username }]
    });

    if (!user) {
      throw new AuthenticationError('Error signing in');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Error signing in');
    }

    // JWT 생성 및 반환
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  },
  toggleFavorite: async (parent, {id}, { models, user }) => {
    //  전달된 user context가 없으면 error던지기
    if (!user) {
       throw new AuthenticationError();
    }
    // 사용자가 노트를 이미 즐겨찾기했는지 확인
    let noteCheck = await models.Note.findById(id);
    const hasUser =  noteCheck.favoritedBy.indexOf(user.id);

    // 사용자가 목록에 있으면
    // favoriteCount를 1 줄이고 목록에서 사용자 제거
    if (hasUser >= 0) {
      return await mongoose.models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: -1
          }
        },
        {
          // new를 true로 설정하여 업데이트된 doc반환
          new: true
        }
      );
    } else {
      // 사용자 목록에 없으면
      // favoriteCount 를 1늘리고 사용자를 목록에 추가
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: 1
          }
        },
        {
          new: true
        }
      )
    }
  }
}