module.exports = {
    db_addr: {
        user: 'sa',
        password: 'sa@123',
        server: '192.168.1.253',
        database: 'RYCPDC_C20191111new',
        // database: 'RYCPDC_C20191111',
        // database1: 'RYCPDC_C20190902',
        // database2: 'RYCPDC_C20191014',
        port: 1433,
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 3000
        }
    },
    access_addr: 'Provider=Microsoft.Jet.OleDb.4.0;Data Source=RYCPDC.mdb;Jet OLEDB:Database Password=sa@123',
    access_addr_c: 'Provider=Microsoft.Jet.OleDb.4.0;Data Source=C:\\SmartMedical\\CPDC\\Database\\RYCPDC.mdb;Jet OLEDB:Database Password=sa@123',
    access_addr_loaclhost: 'Provider=Microsoft.Jet.OleDb.4.0;Data Source=localhost\\Database\\RYCPDC.mdb;Jet OLEDB:Database Password=sa@123',
}