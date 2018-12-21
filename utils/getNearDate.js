
//这是返回4个日期 单位是 日
function getNearFourDate() {
    function fun_date(aa) {
        var date1 = new Date(), 
            time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
        var date2 = new Date(date1);
        date2.setDate(date1.getDate() + aa);
        var time2 = date2.getDate();
        return time2;
    }
    let array = [fun_date(0), fun_date(1), fun_date(2), fun_date(3)]
    return array;
}
//这是返回4个日期 单位是 星期几
function getNearFourWeekday() {
    function next(value, array) {
        let index = array.indexOf(value);
        if (index < 6) {//console.log(array[index+1])
            return array[index + 1];
        }
        else {
            //console.log(array[0])
            return array[0];
        }
    };
    //main
    let array = ["日", "一", "二", "三", "四", "五", "六"];
    let date = new Date();
    let today = array[date.getDay()];
    let result = [today];
    for (let i = 0; i < 3; i++) {
        result.push(next(result[result.length - 1], array))
    }
    return result;
}
//打包成一个数组
function getNearDate(){
    let array = [];
    let day = getNearFourDate() ;
    let weekday = getNearFourWeekday() ;
    for(let i in day){
        array.push({
            day:day[i],
            weekday:weekday[i]
        })
    }
    return array;
}
module.exports = {getNearDate}