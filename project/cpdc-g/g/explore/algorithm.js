
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var twoSum = function (nums, target) {
    const n = nums.length
    let l = 0, r = n - 1
    while (l < r) {
        let sum = nums[l] + nums[r]
        if (sum == target) return [nums[l], nums[r]]
        else if (sum > target) r -= 1
        else l += 1
    }
    return []
};

console.time()
console.log(twoSum([2, 7, 11, 15], 26))
console.timeEnd()


