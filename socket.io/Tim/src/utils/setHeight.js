/**
 * 获取className 并设置其高度
 * @param  {String} className 类名
 * @param  {Number} Height    高度
 * @param  {Number} offset    偏移值
 * @return {[type]}           [description]
 */
function _getClassNameBySetHeight(className, Height, offset) {

    if (document.getElementsByClassName(className) &&
        document.getElementsByClassName(className)[0] &&
        document.getElementsByClassName(className)[0].style) {
        document.getElementsByClassName(className)[0].style.height = (Height - offset) + "px";
    }

}
let setHeight = function() {
    let _clientHeight = (document.documentElement.clientHeight || document.body.clientHeight);
    // 设置 body 的高度
    // document.body.style.height = _clientHeight + "px";
    // document.documentElement.style.height = _clientHeight + "px";

    // 设置背景颜色的高度
    _getClassNameBySetHeight('bg-color', _clientHeight, 0)
    // 设置侧边的高度
    _getClassNameBySetHeight('aside-group', _clientHeight, 80)
    // 设置中间的高度
    _getClassNameBySetHeight('content', _clientHeight, 80)

    // console.log(document.documentElement.clientHeight || document.body.clientHeight)
}
window.onresize = () => {
    setTimeout(function() {
        setHeight()
    }, 500)
}
export default setHeight