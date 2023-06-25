/**
 * 目标1：验证码登录
 * 1.1 在 utils/request.js 配置 axios 请求基地址
 * 1.2 收集手机号和验证码数据
 * 1.3 基于 axios 调用验证码登录接口
 * 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
 */

// 1.1 在 utils/request.js 配置 axios 请求基地址

// 1.2 收集手机号和验证码数据
document.querySelector('.btn').addEventListener('click',()=>{
    const form = document.querySelector('.login-form')
    // 用serialize获取表单对象
    const data=serialize(form,{hash:true,empty:true})
    // console.log(data);


    // * 1.3 基于 axios 调用验证码登录接口
    axios({
        url:'/v1_0/authorizations',
        method:'post',
        data
        // 这里的数据就是serialize获取的data 因为同名所以可以直接写成data
    }).then(result=>{

        // * 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
        myAlert(true,'登录成功')
        // 加token 设置访问权限的令牌
        localStorage.setItem('token',result.data.token)
        // 这里加了个定时器是 因为不加的话跳转太快不好看
       setTimeout(()=>{        location.href='../content/index.html'
    },1000)
        // location.href='../content/index.html'
        console.log(result);
    }).catch(error =>{
        myAlert(false,error.response.data.message)
        console.dir(error.response.data.message);
    })
})

