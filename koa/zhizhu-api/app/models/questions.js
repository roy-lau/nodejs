/**
 * 问题 模型
 */
const mongoose = require('mongoose'),
  { Schema, model } = mongoose,

  questionSchema = new Schema({
    __v: { type: Number, select: false },
    //  标题
    title: { type: String, required: true },
    // 描述
    description: { type: String },
    // 简介
    questioner: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    topics: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
      select: false
    }
  },{timestamps:true})

module.exports = model('Question', questionSchema)