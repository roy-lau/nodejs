const mysql = require("./index");

// DROP TABLE IF EXISTS `user`;
// 创建数据表
// CREATE TABLE IF NOT EXISTS  `user` (
//    `Id`  int(11) UNSIGNED AUTO_INCREMENT COMMENT '主键',
//    `user` varchar(100) NOT NULL COMMENT '用户名',
//    `pwd` varchar(100) NOT NULL COMMENT '密码',
//    `ip` varchar(40) NOT NULL,
//    `adder` varchar(50) NOT NULL,
//    `create_date` DATE,
//    PRIMARY KEY ( `Id` )
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

module.exports = {
  /*
    @title {新增} 在表格内插入一行数据
    @param {String} 表格名
    @return {Object} 查询数据
  */
  async add(params) {
    const db = await mysql();
    try {
      const addSql =
        "INSERT INTO user(Id,user,pwd,ip,adder,create_date) VALUES(0,?,?,?,?,?)";

      const result = await db.query(addSql, params);
      return result;
    } catch (error) {
      await db.rollback();
      console.error(error);
    } finally {
      await db.close();
    }
  },
  /*
    @title {查询} 查询表格数据
    @param {String} 表格名
    @return {Object} 查询数据
  */
  async query(tableName) {
    const db = await mysql();
    try {
      const result = await db.query(`SELECT * FROM ${tableName}`);
      return result;
    } catch (error) {
      await db.rollback();
      console.error(error);
    } finally {
      await db.close();
    }
  },
  /*
     @title {修改}
     @param {String} 修改……
     @param {Array} 修改行的数据
   */
  async update(params) {
    const sql = "UPDATE user SET user = ?,pwd = ? WHERE Id = ?";
    // const params = ['user1', 'pwd456', 1];

    const db = await mysql();
    try {
      const result = await db.query(sql, params);
      return result;
    } catch (error) {
      await db.rollback();
      console.error(error);
    } finally {
      await db.close();
    }
  },
  /*
    删除表格行
    @param {String} 表格名
    @param {Number} 表格行
  */
  async del(tebleName, id) {
    const db = await mysql();
    try {
      const result = await db.query(`DELETE FROM ${tebleName} where id=${id}`);
      return result;
    } catch (error) {
      await db.rollback();
      console.error(error);
    } finally {
      await db.close();
    }
  },
};
