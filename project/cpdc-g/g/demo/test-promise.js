

function one() {
    return new Promise((resolve, reject) => {
        resolve("hi")
    })
}
 async function two(str) {
    console.log(2)
    console.log(str)
    const s = await three(str)
    console.log(s)
    return s
}

function three(str) {
    console.log(3)
    return str
}
function end(str) {
    console.log('end')
    console.log(str)
}
one()
    .then(two)
    .then(end)