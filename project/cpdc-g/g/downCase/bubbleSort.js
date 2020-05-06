/**
 * 冒泡排序
 * 
 * @param {Arrary} arr 需要排序的数组
 * @returns {Arrary} arr 排序后的数组 
 */
function bubbleSort (arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            console.log(arr[j], arr[j + 1])
            // if (arr[j] > arr[j + 1]) {
            //     let tmp = arr[j]
            //     arr[j] = arr[j + 1]
            //     arr[j + 1] = tmp
            // }
        }
    }
    return arr
}
const sortedArr = bubbleSort([1, 23, 5, 6, 7, 8, 2, 4, 9])
// console.log(sortedArr)