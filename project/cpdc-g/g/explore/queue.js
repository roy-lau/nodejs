class Queue {
    constructor() {
        this.dataStore = [];
    }
    /**
     * enqueue：向队列添加元素
     * 
     * @description 向队列末尾添加一个元素，直接调用 push 方法即可
     * @param {any} element 要入队的元素
     */
    enqueue (element) {
        this.dataStore.push(element);
    }
    /**
     * dequeue：删除队首的元素
     * 
     * @description 删除队列首的元素，可以利用 JS 数组中的 shift 方法
     * @returns 如果队列为空，返回 This queue is empty
     */
    dequeue () {
        if (this.empty()) return 'This queue is empty';
        else this.dataStore.shift();
    }
    /**
     * empty：判断队列是否为空
     * 
     * @description 通过判断 dataStore 的长度就可知道队列是否为空
     * @returns {Boolean} 如果队列为空，返回 true。否则返回 false
     */
    empty () {
        if (this.dataStore.length == 0) return true;
        else return false;
    }
    /**
     * front：查看队首元素
     * 
     * @returns {Number|String} 如果队列为空，返回 This queue is empty。否则返回队首的元素
     */
    front () {
        if (this.empty()) return 'This queue is empty';
        else return this.dataStore[0];
    }
    /**
     * back：查看队尾元素
     * 
     * @returns {Number|String} 如果队列为空，返回 This queue is empty。否则返回队尾的元素
     */
    back () {
        if (this.empty()) return 'This queue is empty';
        else return this.dataStore[this.dataStore.length - 1];
    }
    /**
     * toString：查看队列中所有元素
     */
    toString () {
        return this.dataStore.join('\n');
    }
    /**
     * clear：清空队列中所有元素
     */
    clear () {
        delete this.dataStore;
        this.dataStor = [];
    }
}

//基数排序

var queues = [];    //定义队列数组
var nums = [];      //定义数字数组

//选十个0~99的随机数进行排序
for ( var i = 0 ; i < 10 ; i ++ ){
    queues[i] = new Queue();
    nums[i] = Math.floor( Math.random() * 101 );
}

//排序之前
console.log( 'before radix sort: ' + nums );

//基数排序
distribution( nums , queues , 10 , 1 );
collect( queues , nums );
console.info('after radix sort: ' + nums );
distribution( nums , queues , 10 , 10 );
collect( queues , nums );

//排序之后
console.info('after radix sort: ' + nums );

//根据相应的（个位和十位）数值，将数字分配到相应队列

function distribution ( nums , queues , n , digit ) {  //digit表示个位或者十位的值
    for( var i = 0 ; i < n ; i++ ){
        if( digit == 1){
            queues[ nums[i] % 10 ].enqueue( nums[i] );
        }else{
            queues[Math.floor(nums[i] / digit) % digit].enqueue(nums[i]);
        }
    }
}

//从队列中收集数字

function collect ( queues , nums ) {
    var i = 0;
    for ( var digit = 0 ; digit < 10 ; digit ++ ){
        while ( !queues[digit].empty() ){
            nums[ i++ ] = queues[digit].front();
            queues[digit].dequeue();
        }
    }
}