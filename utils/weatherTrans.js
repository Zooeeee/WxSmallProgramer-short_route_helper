let src = (string,serverHttp)=>{
    if(string.indexOf('转')){
        let arr = string.split('转');
        string = arr[0];
    }
    return serverHttp+'/static/weather/'+'天气-'+string+'.png';
}

module.exports = {src}