// axios 公共配置
// 基地址

axios.defaults.baseURL = 'http://geek.itheima.net'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 同意携带 token 令牌字符串在请求头上
    const token=localStorage.getItem('token')
    token && (config.headers.Authorization = `Bearer ${token}`)
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。2xx是触发成功回调
    // 对响应数据做点什么  比如 直接返回服务器的响应结果对象
    const result=response.data
    return result;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。 
    // 对响应错误做点什么，例如：判断响应状态为 401 代表身份验证失败 即token无效
    if (error?.response?.status === 401) {
        // 这里error?.response?.status链式判断
      alert('登录状态过期，请重新登录')
    //   清空缓存
      window.location.href = '../login/index.html'
    }
    return Promise.reject(error);
  });