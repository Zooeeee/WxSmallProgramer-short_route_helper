//将 place.js得到的所有出行路线数据 转化成一个 obj 返回
function format(obj) {

    return 1;
  }


//获得返回计划中的几日游  返回类型为数组 ["一日游","三日游"]
function getPickers(obj){
    let arr = [];
    for (const iterator of obj) {
        arr.push(iterator.name);
    }
    return arr ;
}

module.exports = {format,getPickers};