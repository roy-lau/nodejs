
/**
 * 脱敏函数
 * @param  {String} str      需要脱敏的字符串
 * @param  {Number} beginStr 开始位置
 * @param  {Number} endStr   结束位置
 * @return {String}          脱敏后的数据
 *
 * desensitization('刘强',1,3)
 * "刘**"
 * desensitization('河南省新郑市',3,8)
 * "河南省*****"
 * desensitization('13526636962',3,8)
 * "135*****962"
 *
 */

exports.desensitization = function(str, beginStr, endStr,showEnd) {
    if (!str) return
    try {

        let len = String(str).length,
            leftStr = String(str).substring(0, beginStr),
            rightStr = String(str).substring(endStr, len),
            _str = ''

        for (let i = 0; i < endStr - beginStr; i++) {
            _str = _str + '*';
        }
        _str = leftStr + _str + (showEnd?rightStr:'');
        return _str;

    } catch (error) {
        console.error('desensitization error: ', error)
    }
}


// module. exports={
// find:function(){},
// save:function(){}
// };