const parentArr = require('./out/parentArr.json'),
    childArr = require('./out/childArr.json'),
    { saveFile} = require('./utils')

var allArr = []
for (let i = parentArr.length - 1; i >= 0; i--) {
    const parentItem = parentArr[i]

    allArr[i] = {
        key: parentItem.ITEM_TYPE_CODE,
        name: parentItem.ITEM_TYPE_NAME,
        childs: parentItem.childs,
        mark: '这是一级'
    }
    for (let c = childArr.length - 1; c >= 0; c--) {
        const childItem = childArr[c]

        if (parentItem.ITEM_TYPE_CODE === childItem.ITEM_TYPE_CODE) {

            allArr[i].childs.push({
                key: childItem.ITEM_CODE,
                name: childItem.ITEM_NAME,
                childs: childItem.childs,
                mark: '这是二级'
            })
            break
        } else if (parentItem.childs.length) {
            // console.log(parentItem.childs)
            // console.log(allArr[i].childs)
            for (let k = parentItem.childs.length - 1; k >= 0; k--) {
                const parentChildsItem = parentItem.childs[k]

                if (parentChildsItem.ITEM_TYPE_CODE === childItem.ITEM_TYPE_CODE) {

                    allArr[i].childs[k].childs = {
                        key: childItem.ITEM_CODE,
                        name: childItem.ITEM_NAME,
                        childs: childItem.childs,
                        mark: '这是三级'
                    }

                }
            }

        }
    }
}
saveFile('./out/allArr.json', JSON.stringify(allArr, null, 2))
console.log(allArr)