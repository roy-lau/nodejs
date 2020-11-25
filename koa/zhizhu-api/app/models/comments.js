/**
 * 评论 模型
 */
const mongoose = require('mongoose'),
  { Schema, model } = mongoose,

  commentSchema = new Schema({
    __v: { type: Number, select: false },
    // 内容
    content: { type: String, required: true },
    // 评论人
    commentator: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    // 问题 id
    questionId: { type: String, required: true },
    // 回答 id
    answerId: { type: String, required: true },
    // 根评论 id
    rootCommentId: { type: String},
    // 回复给那个用户
    replyTo: { type: Schema.Types.ObjectId, ref: 'User'}
  },{timestamps:true})

module.exports = model('Comment', commentSchema)