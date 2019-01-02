const express = require('express')
const app = express();
const doSql = require('./doSql');
//解析json文件所用的 bodyParser
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
app.use(bodyParser.json({ limit: '1mb' }));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
	extended: true
}));

app.use('/static', express.static('font'));


app.get('/', (req, res) => {
	res.send('hello world');
}
)
//post记录下nickName
app.post('/nickName', (req, res) => {
	console.log("-------nickName-----------");
	console.log("添加用户信息，该post请求用户的昵称为" + req.body.nickName);
	doSql.addUserNickname(req.body.nickName);
}
)//post '/nickName' ---end

//添加历史地点
app.post('/addPlace', (req, res) => {
	console.log("-------addPlace-----------");
	console.log("添加历史地点post", req.body);
	console.log("nickName:", req.body.nickName);
	console.log("city:", req.body.city);
	doSql.addUserCity(req.body.nickName, req.body.city)
})
//添加历史地点 ----end

app.post('/getAllplace', (req, res) => {
	console.log("-------getAllPlace-----------");
	doSql.getAllPlace('Zoe',res);
})
//添加历史地点 ----end

app.delete('/deletePlace',(req,res)=>{
	console.log("delete收到的数据",req.body);
	let nickName = req.body.nickName;
	let deletePlace = req.body.deletePlace;
	doSql.deletePlace(nickName,deletePlace);
	res.send("删除收到")
})


app.listen(3000, () => console.log('Example app listening on port 3000!'));

