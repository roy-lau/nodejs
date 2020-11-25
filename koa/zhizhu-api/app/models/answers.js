/**
 * 回答/回复/答案 模型
 */
const mongoose = require('mongoose'),
  { Schema, model } = mongoose,

  answerSchema = new Schema({
    __v: { type: Number, select: false },
    // 内容
    content: { type: String, required: true },
    // 回答者
    answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    // 问题 id
    questionId: { type: String, required: true },
    // 回答数
    voteCount:{type: Number,required:true,default:0}
  },{timestamps:true})

module.exports = model('Answer', answerSchema)