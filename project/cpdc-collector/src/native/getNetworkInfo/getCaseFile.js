const Axios = require('axios'),
fs = require('fs'),
path = require('path')
    URL_xh = 'https://chinacpdc.org.cn:9120/api/',
    URL_conpany = 'http://192.168.1.253:8087/api/'

/*
	登录
 */

async function login() {
    try {
        const { data: res } = await Axios.post(URL_conpany + 'Login/Login', { UserName: "BguAbPL6", PassWord: "55Z8yj4hMaN5", ipAddress: "", macAddress: "", RoleCode: "admin" })
        return res.Data.Token
    } catch (e) {
        console.error(e)
    }
}

// 获取文件下载路径 (不需要token也能下载)

async function getFileLink() {
    try {
        const list_PatientId = 'IP0001320978,IP0001320681,0001319284,0010599319,IP0000247816,0017446761,0017219763,0001796519,0017235823,IP0001320533,0017222719,0003897654,0017245389,0017020976,0017094058,0017078813,0017126710,0016355069,0017114371,0003507655,0014663006,IP0001327481,0007647546,0018440945,0018138145,0018169882,0008942920,0017745482,0015942112,0018884226,0017903281,0018169743,0017788342,IP0001423688,IP0001548724,0017777113,0015979481,0017596875,IP0001424159,0015216732,0017916472,0018182166,0007504425,0018703871,IP0001434501,0018314268,0002959217,0018435539,0001215242,0018626671,0003956720,0018097367,IP0001429171,0017605709,0000039429,0018889049,IP0001531507,0006114691,001761912,0000581401,0017797806,0018987892,0018108099,001585061,0017797127,0017898812,IP0001538655,0018562820,0003465333,0018433673,0006731741,0000091573,IP0001550930,0017120885,0017895498,0017518949,0018243916,0017824282,0008047369,0012707389,0018130345,0018234993,0017568846,0017786588,0018934999,0018744505,0015686600,0016726824,0000790589,IP0001550016,0018373930,0000500572,0018038884,0009600578,0018414560,0018712772,0017703742,0017571975,0015015920,0017922504,0018009598,IP0001430914,0018220863,0018835219,0017744268,0018275956,0017643173,IP0001555353,0017694517,0018185444,0008366700,00008366700,IP0001555913,IP0001427647,0017651818,0018499812,0013375445,0017798555,IP0001545303,0015695210,0017846754,19137607,19560155,6226738,19207371,19188090,19216615,19579241,17645695,19102801,19701712,1758949,19117264,16995412,18124095,19273912,IP0001609027,IP0001669903,14483411,256581,19223744,19727462,19457057,8124359,19424227,43046,3670133,IP0001645816,17011660,19546758,19608268,1351679,19001108,18965200,16882119,1337602,19050376,19085499,19708502,19742916,19759618,10195397,19132464,19011262,19451613,19486462,8512496,814013,IP0001652102,19712109,19455206,929162,IP0001584640,19366018,19277374,19451332,459673,8234803,18669452,16497626,19139197,19126324'
        PatParam = { "PatientId": list_PatientId, "InpNo": "IP0004025033", "Name": "", "Sex": "", "sAge": "", "eAge": "", "OutStatus": "", "CreateUser": "", "HospitalId": "", "DataVerify": "0", "SdCode": "YXA_O", "PageSize": "10", "PageIndex": "1", "UserId": "2831581f581ff529" },
            param = {
                patParam: JSON.stringify(PatParam),
                itemParam: ''
            },
            { data: res } = await Axios.get(URL_conpany + 'Case/ExportDataPack', { params: param })
            console.log(res)
            await downloadFile(res.Msg,'./download','病例-'+Date.now()+'.ry')
    } catch (e) {
        console.error(e)
    }
}


/**
 * 下载网络文件
 * @param  {[type]} url:      string        网络文件地址
 * @param  {[type]} filepath: string        本地目录
 * @param  {[type]} name:     string        文件名
 * @return {[type]}           [description]
 */
async function downloadFile(url, filepath, name) {
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
    }
    try{
        const mypath = path.resolve(filepath, name);
        const writer = fs.createWriteStream(mypath);
        const response = await Axios({
            url:encodeURI(url),
            method: "GET",
            responseType: "stream",
        });
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
    }catch(e){
        console.log('ERR downloadFile',e)
    }
}

getFileLink()