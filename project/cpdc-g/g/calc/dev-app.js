
/**
 * 计算字段的完整度
 * 修改最大堆栈 node --max-old-space-size=4096 calc-fild.js
 */
'use strict';
const sql = require('../dbs/sqlServer-t.js'),
    XLSX = require("xlsx"),
    X_utils = XLSX.utils,
    _ = require("lodash"),
    ProgressBar = require('progress'),
    OBJ_CALC = Object.create(null)

class CALC {
    constructor(){

    }
    
    /**
     * 初始化患者基本信息
     */
    initPatVist(){
        const initPatVist = Object.create(null)
    }
}