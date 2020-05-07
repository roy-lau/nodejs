// 参考 https://www.jianshu.com/p/f254ec665e57
//链表类
class LList {
    constructor() {
        this.head = this.Node('head');     //头节点
    }
    /**
     * 节点
     * 
     * @param {any} element 当期节点的元素
     */
    Node (element) {
        this.element = element;   //当前节点的元素
        this.next = null;         //下一个节点链接
    }

    //查找给定节点

    find (item) {
        var currNode = this.head;
        while (currNode.element != item) {
            currNode = currNode.next;
        }
        return currNode;
    }
}