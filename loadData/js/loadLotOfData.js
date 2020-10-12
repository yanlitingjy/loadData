/** @description: 加载10万条数据
实现方式：
获取容器元素的高度 clientHeight
列表项元素的高度 offsetHeight
计算可视区域应该渲染的列表项的个数 count = clientHeight / offsetHeight
计算可视区域数据渲染的起始位置 start
计算可视区域数据渲染的结束位置 end
对完整长列表数据进行截断 sliceList = dataList.slice(start, end)
渲染截断后的列表数据，进而实现无限加载
 * @param {parentNode,ChildNode} 
 * @return {object} 
 */
class loadLotOfData {
    //初始化
    constructor(parentNode,ChildNode){
        this.parentNode = parentNode;
        this.ChildNode = ChildNode;
        this.intersection()
    }
    $(selector) {
        return document.querySelector(selector)
    }
    //获取10万条数据
    getDataList() {
        let data = []
        for(let i = 0; i < 100000; i++) {
            data.push({index:i,value:i+10})
        }
        return data;
    }
    //加载数据
    loadData(start, end) {
        let sliceData = this.getDataList().slice(start, end)// 截取数据
        let fragment = document.createDocumentFragment(); 
        for(let i = 0; i < sliceData.length; i++) {
            let li = document.createElement('li');
            li.innerText = JSON.stringify(sliceData[i])
            fragment.appendChild(li);
        }
        this.$(this.parentNode).insertBefore(fragment, this.$(this.ChildNode));
    }
    
    intersection(){
        var count = Math.ceil(document.body.clientHeight/40) //40表示每一个li的高度
        var startIndex = 0;
        var endIndex = 0
        let io = new IntersectionObserver((entries)=> {
            this.loadData(startIndex ,count)
            if(entries[0].isIntersecting){
                startIndex = startIndex += count
                endIndex = startIndex  + count
                if(endIndex>=this.getDataList().length){
                    io.unobserve(entries[0].target)
                }
            }
            requestAnimationFrame(() => {
                this.loadData(startIndex, endIndex)
                let num = Number(this.getDataList().length - startIndex)
                let info = `还有${num}条数据`
                this.$('.top').innerText = info
            })
        })
        io.observe(this.$(this.ChildNode));
    }
}
new loadLotOfData('.container','.sentinels')