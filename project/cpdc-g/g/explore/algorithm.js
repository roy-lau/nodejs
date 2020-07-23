

const getRandom = (min = 0, max = 1) => ~~(Math.random() * (max - min) + min)
const arr = Array.from({ length: 5 }, () => getRandom(0, 14))
// --- 10 out
// 1 1
// 1 2
// 1 3
// 1 4

// ---- 9 in
// 2 2
// 2 3
// 2 4

// --- 12 out
// 3 3
// 3 4
// 3 5

// --- 9 in
// 4 4
// 4 5

const findContinuousSequence = function (target) {
    const vec = [],
        limit = (target - 1) / 2; // (target - 1) / 2 等效于 target / 2 下取整
    let res = [], sum = 0;

    for (let x = 1; x <= limit; ++x) {
        let delta = 1 - 4 * (x - 1ll * x * x - 2 * target);
        if (delta < 0) continue;
        let delta_sqrt = Math.sqrt(delta + 0.5);
        if (1ll * delta_sqrt * delta_sqrt == delta && (delta_sqrt - 1) % 2 == 0){
            let y = (-1 + delta_sqrt) / 2; // 另一个解(-1-delta_sqrt)/2必然小于0，不用考虑
            if (x < y) {
                res.clear();
                for (let i = x; i <= y; ++i) res.emplace_back(i);
                vec.emplace_back(res);
            }
        }
    }
    return vec;
};

console.time()
console.log(findContinuousSequence(10e6))
console.timeEnd()


