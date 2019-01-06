// require the module
let EasyMySQL = require('easy-mysql');
let settings = {
    user: 'root',
    password: '123456',
    database: 'WxServer'
};
const easy_mysql = EasyMySQL.connect(settings);


let testConnect = () => {
    let sql = 'select * from user_Nickname';
    easy_mysql.get_all(sql, function (err, results) {
        console.log(results);
    });
}

//往昵称id表中加入数据
let addUserNickname = (nickName) => {
    let sql = `INSERT 
    into user_nickname(nickName)
    VALUES(?)`;
    let sqlParameter = nickName;
    easy_mysql.execute(sql, sqlParameter, function (err, results) {
        console.log(results);
    });
    //往访问记录中加入数据
    let sql2 = `INSERT 
    INTO visit_count(nickName)
    VALUES(?)`;
    easy_mysql.execute(sql2, sqlParameter, function (err, results) {
        console.log(results);
    });

};

//往userplace表中加入数据
let addUserCity = (nickName, city) => {
    let sql = `INSERT 
    INTO user_place
    VALUES (?,?)`;
    let sqlParameter = [nickName, city];
    easy_mysql.execute(sql, sqlParameter, function (err, results) {
        console.log("执行addUserCity函数")
    });
};



//删除userplace表中的某些值
let deletePlace = (nickName, deletePlace) => {
    let sql = `DELETE FROM user_place WHERE nickName = ? and place = ? `;
    let sqlParameter = [nickName, deletePlace];
    easy_mysql.get_all(sql, sqlParameter, function (err, results) {
        if (err)
            console.log("删除错误")
        if (results)
            console.log(results);
    })

};

//获得userplace表中的所有地点值
let getAllPlace = (nickName, res) => {
    let sql = 'select * from user_place where nickName = ?';
    let sqlParameter = nickName;
    easy_mysql.get_all(sql, sqlParameter, function (err, results) {
        let array = [];
        results.forEach(element => {
            array.push(element.place);
        });
        console.log(array)
       res.send(array);
    })
};





module.exports = { testConnect, addUserNickname, addUserCity, getAllPlace, deletePlace }