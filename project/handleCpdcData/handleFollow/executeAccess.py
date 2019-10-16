#coding:utf8

import pypyodbc

#操作Access数据库类
class getAccess:
    def __init__(self,db_name, password = ""):
        self.db_name = db_name
        self.password = password
        self.connectDB()    #调用连接函数

    def connectDB(self):
        str = 'Driver={Microsoft Access Driver (*.mdb)};PWD=' + self.password + ";DBQ=" + self.db_name
        try:
            self.conn = pypyodbc.win_connect_mdb(str)
        except:
            print(u"数据库连接失败！请检查！")

    #拿到游标方法
    def getCur(self):
        try:
            return self.conn.cursor()
        except:
            return

    #执行sql语句的方法
    def selectDB(self, cur, sql):
        try:
            cur.execute(sql)
            return cur.fetchall()
        except:
            return []

    #关闭数据库
    def close(self):
        try:
            self.conn.close()
        except:
            return

if __name__ == '__main__':
    conn = getAccess("./RYCPDC.mdb", "sa@123")
    # conn = getAccess("C:\\SmartMedical\\CPDC\\Database\\RYCPDC.mdb", "sa@123")
    cur = conn.getCur()
    sql = "SELECT * FROM PAT_FOLLOW_UP" #中文需要前面加u
    data = conn.selectDB(cur, sql)
    print(len(data))