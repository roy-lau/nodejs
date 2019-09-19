'use strict';
const groupBy = require('lodash.groupby');
const tube = require("./out/2-1.filtertableData.json")

let tmpArr = [],
    tmpObj = {},
    objArr = []

for (let i = 0; i < tube.length; i++) {
    const element = tube[i],
        _tubeKey = Object.keys(element)[1],
        _splitKey = _tubeKey.split('#');


    if (tmpArr.indexOf(_splitKey[2]) > -1) {
        console.log(i, 'if tow')
        tmpObj[_splitKey[1]] = element[_tubeKey]
    } else {
        console.log(i, '四次')
        tmpArr = []
        tmpObj = {}
        tmpObj['PATIENT_NO'] = element.PATIENT_NO
        tmpObj[_splitKey[1]] = element[_tubeKey]
        objArr.push(tmpObj)
        tmpArr.push(_splitKey[2])
    }
}
// console.log(objArrIn)
console.log(objArr)
// objArr.map(item =>{
//     // console.log(item)
//     let _tmpArr = [],
//         _tmpObj={},
//         _objArr = []
//     for (const key in item) {
//         if (item.hasOwnProperty(key)) {
//             const element = item[key],
//                 _key = key.split('#');
//             // console.log(key.split('#'),element)
//             // console.log(item)
//             // for (let i = 0; i < item.length; i++) {
//                 if (_tmpArr.indexOf(_key[2])>-1) {

//                     _tmpObj[_key[1]]= element
//                 }else{

//                     _tmpObj={}
//                     _tmpObj['PATIENT_NO']= item.PATIENT_NO
//                     _objArr.push(_tmpObj)

//                     _tmpArr.push(_key[2])
//                 }
//             // }
//         }
//     }
//     console.log(_objArr)
// })