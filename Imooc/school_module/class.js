// 这是一个班级
// 引入学生和老师的对象方法
var student = require("./student");
var teacher = require("./teacher");

// 下边是一个添加 的方法
function add(teacherName, students) {
  // 添加老师名
  teacher.add(teacherName);

  // 遍历学生
  students.forEach(function (item, index) {
    student.add(item);
  });
}
// 暴露添加的方法
exports.add = add;

// module.exports = add
//
//
// module.exports是真实存在的方法。exports是module.exports下挂载的方法！
