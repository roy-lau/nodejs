const mysql = require("mysql");

class MysqlModel {
    constructor() {
        const config = {
            connectionLimit: 10,
            host: '139.199.99.154',
            user: 'root',
            password: 'toor123',
            database: 'bbs_koa_test'
        }
        this.mysqlConfig = config
    }

    /**
    * 实例化mysql
    */
    mysqlInstance() {
        /**
         * 连接池集群选项 - 创建集群连接时，可以传入个含有以下可选值的参数对象：
            canRetry： 当为true时，PoolCluster会在连接失败时尝试重连（默认：true）
            removeNodeErrorCount： 连接失败时Node的errorCount计数会增加。当累积到这个值时移除PoolCluster这个节点（默认：5）
            restoreNodeTimeout： 连接失败后重试连接的毫移数（默认：0）
            defaultSelector： 默认的选择器（selector）（默认：RR）
                      RR－依次选择
                      RANDOM－随机选择
                      ORDER－选择第一个可用节点
         */
        const poolCluster = mysql.createPoolCluster({
            removeNodeErrorCount: 1,
            defaultSelector: "RR"
        });

        const mysqlNodes = this.mysqlConfig;
        // for (let node in mysqlNodes) {
        //   poolCluster.add(`${node}`, mysqlNodes[`${node}`]);
        // }
        poolCluster.add(mysqlNodes);

        return new Promise((resolve, reject) => {
            poolCluster.getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                } else {
                    resolve([
                        connection,
                        poolCluster
                    ]);
                }
            })
        })

    }

    /**
    * 获取mysql数据库连接
    */
    async getConnection() {
        return await this.mysqlInstance();
    }
}

async function mysqlDBUtil() {
    try {
        const db = new MysqlModel();
        const [conn, pool] = await db.getConnection();
        console.log('mysql连接成功')

        // 回滚事务
        const rollback = async function () {
            conn.rollback();
            console.error('mysql事务发生回滚......rollback')
        }

        /**
         * 数据库操作
         * 
         * @param {*} sql 
         * @param {*} options 
         */
        const query = function (sql, options) {
            return new Promise((resolve, reject) => {
                conn.query(sql, options, function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                })
            })
        }

        // 提交事务
        const commit = function () {
            return new Promise((resolve, reject) => {
                conn.commit(function (err) {
                    if (err) reject(err);
                    console.log('mysql事务提交......commit')
                });
            })
        }
        /**
        * 关闭连接池，mysql2的包自己不会释放
        */
        const close = async function () {
            pool.end();
            console.log('mysql连接池关闭.....close');
        }
        return {
            rollback,
            commit,
            close,
            query
        }
    } catch (error) {
        console.error("mysqlDBUtil ERR:")
        throw new Error(error);
    }
}
// 测试是否链接成功
//   async function mysql_test() {
//     const db = await mysql();
//     try {
//       const sql = 'SELECT 1 + 1 AS solution';
//       const result = await db.query(sql);
//       console.log(`The solution is: ${result[0].solution} ,测试连接成功！`);
//       return result
//     } catch (error) {
//       await db.rollback();
//     } finally {
//       await db.close();
//     }
//   }
//   mysql_test()

module.exports = mysqlDBUtil;

