let fs = require("fs");
let http = require("http");

let id = 0; //数据唯一ID;

const dataSave = JSON.parse(fs.readFileSync("./localData.txt", 'utf-8'));//读取本地数据中的用户

for (let alrId in dataSave) {  //将本地id最后一位取出来
   id = Math.max(parseFloat(alrId), id);
}
id++; //保证id唯一

/**
 *
 *
 * @param {单个用户对象} userObj
 * @param {用来保存数据的JSON对象} dataSave
 * @returns Boolean
 */

function repeatUsername(userObj, dataSave) { //功能函数,判断用户名是否已经存在 函数。
   for (let item in dataSave) {
      let username = JSON.parse(dataSave[item])['username'];
      if (username === userObj['username']) {
         return false;  //如果用户名已存在，返回false;
      }
   }
   return true;//不存在返回true;
}

let server = http.createServer(function (res, ron) {
   ron.writeHead(200, { 'Content-type': 'text/html;charset=utf8' });
   if (res.url === `/favicon.ico`) {
      return;
   }
   if (res.url === `/`) {
      ron.write(`code:403;注册失败！请输入！`);
      ron.end();
      return;
   }


   let userInfo = res.url.substr(2); //分割地址中?后面的部分。
   let userObj = {}; //用来保存单条数据的对象

   let userArr = userInfo.split(`&`);//检查数据保存到userObj中。
   userArr.forEach((element) => {
      let e = element.split(`=`);
      userObj[e[0]] = e[1];
   });


   if (repeatUsername(userObj, dataSave)) { // 调用判断用户名是否存在函数
      dataSave[id++] = JSON.stringify(userObj);
      fs.writeFileSync("./localData.txt", JSON.stringify(dataSave));
      ron.write(`code:200;你好!${userObj['username']};注册成功！`);
      ron.end();
   } else { 
      ron.write(`code:404;注册失败！用户名已存在！`);
      ron.end();
   }
});

server.listen(8001);
console.log("服务器已启动。。。。。。。。。");