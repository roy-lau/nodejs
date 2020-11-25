/**
 * 话题 模型
 */
const mongoose = require('mongoose'),
  { Schema, model } = mongoose,

  topicsSchema = new Schema({
    __v: { type: Number, select: false },
    // 名称
    name: {type:String,required:true},
    // 图片
    avatar_url: {type:String},
    // 简介
    introduction:{type:String,select:false},
  },{timestamps:true})

module.exports = model('Topic', topicsSchema)