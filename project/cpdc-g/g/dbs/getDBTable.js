const mssql = require('./SqlServer-t.js')

const fs = require("fs")

function readSyncByfs (tips) {
    tips = tips || '> ';
    process.stdout.write(tips);
    process.stdin.pause();

    const buf = Buffer.allocUnsafe(10000);
    let response = fs.readSync(process.stdin.fd, buf, 0, 10000, 0);
    process.stdin.end();

    return buf.toString('utf8', 0, response).trim();
}

// SELECT Name FROM DatabaseName..SysObjects Where XType='U' ORDER BY Name
// XType='U':表示所有用户表;
// XType='S':表示所有系统表;
async function startup () {
    try {
        const dbList = await mssql.query(`SELECT Name FROM Master..SysDatabases ORDER BY Name`)
        dbList.forEach(async table => {
            const res = await mssql.query(`SELECT Name FROM ${table.Name}..SysObjects Where XType='U' ORDER BY Name`)
            var showTable = readSyncByfs("是否查看数据库 " + table.Name + " (y or n) : ")
            if (showTable !== "n") {
                console.table(res)
            }
        });
        readSyncByfs("查看完毕……")
    } catch (err) {
        console.error(err)
    }
}

startup()