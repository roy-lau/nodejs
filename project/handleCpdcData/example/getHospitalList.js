/**
 * 获取医院列表
 */

const axios = require("axios"),
fs = require("fs"),
    baseUrl = 'https://chinacpdc.org.cn:9120/api/'

/**
 * 平铺一个数组
 * @param  {Array} arr 需要处理的数组
 * @param  {[type]} res 响应
 * @return {Array}     [description]
 */
function flatArray(arr, res) {
    let i=0,cur;
    let len = arr.length;
    for(;i<len;i++) {
      cur = arr[i];
      Array.isArray(cur) ?flat(cur,res):res.push(cur)
    }
    return res;
}
/**
 * 处理 tables 数据
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function handleTable(data){
    return data.map((item ,i)=>{
        return {
            "序号":i+1,
            "医院":item.HospitalName,
            "离院时间":item.DischargeDate,
            "上报时间":item.CreateDate,
        }
    })
}

const getData = async () => {
    // 登录
    const req_login = await axios.post(baseUrl + 'Login/Login', {
            PassWord: "55Z8yj4hMaN5",
            RoleCode: "admin",
            UserName: "BguAbPL6",
            ipAddress: "",
            macAddress: ""
        }),
        { Token } = req_login.data.Data,
        baseToken = 'Basic ' + Token;

    // 获取医院列表
    const req_hospital = await axios.get(baseUrl + 'User/GetHospitalDict', {
            params: { type: '1' },
            headers: { Authorization: baseToken }
        }),
        hospitalList = req_hospital.data.Data


    for(let i =0; i<= hospitalList.length-1;i++){
        await hospital_getTables(baseToken,hospitalList[i].HospitalId)
    }

}

/**
 * 根据医院id，获取医院数据
 * @param  {[type]} hospitalId [description]
 * @return {[type]}            [description]
 */
const hospital_getTables = async (baseToken,hospitalId) => {
    let tables = await getTable(baseToken)
    let _arr = handleTable(tables.PatVisitList)
    // let _arr = new Array(~~tables.Total / 10)

        console.log(hospitalId)
    if (tables.Total > 10) {
        for (let i = 1; i <= ~~tables.Total / 10; i++) {
            let req_tables = await getTable(baseToken,hospitalId, i)
            console.log(i)
            tables = handleTable(tables.PatVisitList)
            _arr.push(tables)
            // 写入文件
            // let writer = fs.createWriteStream("data.json")
            // writer.write(JSON.stringify(_arr));
        }
    }
    console.log(_arr)
}

const getTable = async (baseToken,hospitalId, PageIndex = 1) => {
    // 获取表格
    const req_table = await axios.get(baseUrl + 'DataVerify/GetPatVisitList', {
            params: {
                patParam: {
                    "PatientId": "",
                    "InpNo": "",
                    "Name": "",
                    "Sex": "",
                    "sAge": "",
                    "eAge": "",
                    "OutStatus": "",
                    "CreateUser": "",
                    "HospitalId": hospitalId,
                    "DataVerify": "0",
                    "SdCode": "YXA_O",
                    "PageSize": "10",
                    "PageIndex": String(PageIndex),
                    "UserId": "2831581f581ff529",
                    "FieldSort": "DischargeDate",
                    "FieldOrderSort": "desc"
                },
                itemParam: ''
            },
            headers: { Authorization: baseToken }
        }),
        _tables = req_table.data.Data

    return _tables
}
getData()
// module.exports = getData