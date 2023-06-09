const router = require('koa-router')();
let db = require('../utils/db');
let userModel = require('../Models/UserModel');
let RolesSchema = require('../Models/RoleModel');


// 使用 Postman注册用户

router.get('/register', async (ctx, next) => {
    // 写入一条数据
    await db.insert({tableName:'users',doc:{
        username: "admin",
        password: 'admin',
        phone: "15303663375",
        email: '908240440@qq.com',
        role_id: "admin"
    },schema: userModel}).then((res)=>{
        // console.log(res)
        return ctx.body = {
            "status": 0
        }
    }).catch(err=>{
        return ctx.body = {
            "status": 1,
            "msg":err.message
        }
    });
})



/* 
    用户登录
*/
router.post('/login',async (ctx,next)=>{
    let {username,password} = ctx.request.body;
    await db.find({tableName:'users',conditions:{username,password},schema:userModel}).then(async (value)=>{
        console.log(value[0]);
        if(value.length === 0){
            return ctx.body = {
                "status": 1,
                "msg": "用户名或密码不正确!"
            }
        }else{
            await db.find({tableName:'roles',conditions:{_id:value[0].role_id},schema: RolesSchema}).then(role=>{
                console.log(role[0].menus);
                value[0].role = {
                    menus:role[0].menus
                };
                console.log(value);
                return ctx.body={
                    "status":0,
                    "data":value[0]
                }
            }).catch(err=>{
              return ctx.body = {
                  "status":1,
                  "msg":err.message
              };
            }); 
        }        
        
    }).catch((err)=>{
        return ctx.body ={
            "status":1,
            "msg":err.message
        };
    });
});

module.exports = router









