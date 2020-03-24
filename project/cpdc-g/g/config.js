module.exports = {
    db_addr: {
        user: 'sa',
        password: 'sa@123',
        // server: 'localhost',
        server: '192.168.1.253',
        // database: 'RYCPDC_C20200310',
        // database: 'RYCPDC_C20191111',
        database: 'RYCPDC_C20191111new',
        port: 1433,
        pool: {
            min: 0, //连接池最小连接数，默认0
            max: 10, //连接池最大连接数，默认10
            idleTimeoutMillis: 3000 //设置关闭未使用连接的时间，单位ms默认30000
        }
        /*--其他属性--*/
        // connectionTimeout：             //连接timeout，单位ms 默认 15000
        // requestTimeout：                //请求timeout，单位ms 默认15000
        // parseJSON：                     //将json数据集转化成json obj
    },
    // tedious 包的 SQL 配置
    tdb_addr:{
        'server': '192.168.1.253',
        authentication: {
            type: 'default',
            options: {
                userName: 'sa',
                password: 'sa@123'
            }
        },
        options: {
            database: 'RYCPDC_C20191111new',
            encrypt: false
        }
    },
    access_addr: 'Provider=Microsoft.Jet.OleDb.4.0;Data Source=RYCPDC.mdb;Jet OLEDB:Database Password=sa@123',
    access_addr_c: 'Provider=Microsoft.Jet.OleDb.4.0;Data Source=C:\\SmartMedical\\CPDC\\Database\\RYCPDC.mdb;Jet OLEDB:Database Password=sa@123',
    access_addr_loaclhost: 'Provider=Microsoft.Jet.OleDb.4.0;Data Source=localhost\\Database\\RYCPDC.mdb;Jet OLEDB:Database Password=sa@123',
}