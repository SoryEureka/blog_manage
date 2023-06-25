/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */

// 1.1 获取频道列表数据
async function setChannleList () {
  const res = await axios({
    url: '/v1_0/channels'
  })
  // console.log(res);
  // *  1.2 展示到下拉菜单中
  const htmlStr =
    `<option value="" selected="">请选择文章频道</option>`
    + res.data.channels.map(item => `<option value="${item.id}" >${item.name}</option>`).join('')
  // console.log(htmlStr);
  document.querySelector('.form-select').innerHTML = htmlStr
}
setChannleList()


/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */

// *  2.2 选择文件并保存在 FormData
document.querySelector('.img-file').addEventListener('change', async e => {
  const file = e.target.files[0]
  const fd = new FormData()
  fd.append('image', file)
  // *  2.3 单独上传图片并得到图片 URL 网址
  const res = await axios({
    url: '/v1_0/upload',
    method: 'post',
    data: fd
  })
  // console.log(res);
  // 2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
  const imgUrl = res.data.url
  // console.log(imgUrl);
  document.querySelector('.rounded').src = imgUrl
  document.querySelector('.rounded').classList.add('show')
  document.querySelector('.place').classList.add('hide')

})
// 设置图片之后 点击img可以重新切换封面
// 点击img => 用JS方式触发文件选择元素 click 事件方法
document.querySelector('.rounded').addEventListener('click', e => {
  document.querySelector('.img-file').click()

})



/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */

// *  3.1 基于 form-serialize 插件收集表单数据对象
document.querySelector('.send').addEventListener('click', async e => {
  if (e.target.innerHTML !== '发布') return
  const form = document.querySelector('.art-form')
  const data = serialize(form, { hash: true, empty: true })

  // 发布文章的时候 不需要id属性 所以可以删除（id是为了后续编辑文章）
  delete data.id
  // console.log(data);
  // 收集封面图片地址 并保存到data对象中
  data.cover = {
    // 封面类型
    type: 1,
    //封面图片的url网址
    images: [document.querySelector('.rounded').src]

  }

  // console.log(data);

  // 3.2 基于 axios 提交到服务器保存
  try {
    const res = await axios({
      url: '/v1_0/mp/articles',
      // 这里获取数据 必须内容不能为空 不然会400
      // status 400：前端提交数据的字段名称或者是字段类型和后台的实体类不一致，导致无法封装
      method: 'post',
      data: data
    })
    // console.log(res);

    //  *  3.3 调用 Alert 警告框反馈结果给用户
    myAlert(true, '发布成功(～￣▽￣)～ ')

    // 3.4 重置表单并跳转到列表页
    form.reset()
    // 封面需要手动重置
    document.querySelector('.rounded').src = ''
    document.querySelector('.rounded').classList.remove('show')
    document.querySelector('.place').classList.remove('hide')
    // 富文本编辑器重置
    editor.setHtml('')
    setTimeout(() => {
      location.href = '../content/index.html'
    }, 1500)
  } catch (error) {
    myAlert(false, '发布失败!' + error.response.data.message)
  }


})



  /**
   * 目标4：编辑-回显文章
   *  4.1 页面跳转传参（URL 查询参数方式）
   *  4.2 发布文章页面接收参数判断（共用同一套表单）
   *  4.3 修改标题和按钮文字
   *  4.4 获取文章详情数据并回显表单
   */
  // 4.2 发布文章页面接收参数判断（共用同一套表单）
  // 自调用函数
  ; (function () {
    // console.log(location.search);
    const paramsStr = location.search
    const params = new URLSearchParams(paramsStr)
    params.forEach(async (value, key) => {
      // 当前有要编辑的文章 id 被传入过来
      if (key === 'id') {
        // 4.3 修改标题和按钮文字
        document.querySelector('.title span').innerHTML = '修改文章'
        document.querySelector('.send').innerHTML = '修改'

        // 4.4 获取文章详情数据并回显表单
        const res = await axios({
          url: `/v1_0/mp/articles/${value}`
        })
        // 组织所需要的数据对象 为后续遍历回显到页面上做铺垫
        const dataObj = {
          channel_id: res.data.channel_id,
          title: res.data.title,
          rounded: res.data.cover.images[0],
          content: res.data.content,
          id: res.data.id
        }
        // 遍历数据对象属性 映射到页面元素上 快速赋值
        Object.keys(dataObj).forEach(key => {
          if (key === 'rounded') {
            // 封面设置
            if (dataObj[key]) {
              // 有封面
              document.querySelector('.rounded').src = dataObj[key]
              document.querySelector('.rounded').classList.add('show')
              document.querySelector('.place').classList.add('hide')

            }
          } else if (key === 'content') {
            // 富文本内容
            editor.setHtml(dataObj[key])
          } else {
            // 用数据对象属性名 作为标签name属性选择器值来找到匹配的标签
            document.querySelector(`[name=${key}]`).value = dataObj[key]
          }
        })
      }
    })

  })()

/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */
document.querySelector('.send').addEventListener('click', async e => {
  // 5.1 判断按钮文字，区分业务（因为共用一套表单）
  if (e.target.innerHTML !== '修改') return

  // 5.2 调用编辑文章接口，保存信息到服务器
  // 5.3 基于 Alert 反馈结果消息给用户

  const form = document.querySelector('.art-form')
  const data = serialize(form, { hash: true, empty: true })
  try {
    const res = await axios({
      url: `/v1_0/mp/articles/${data.id}`,
      method: 'put',
      data: {
        // 先解构出来
        ...data,
        cover: {
          type: document.querySelector('.rounded').src ? 1 : 0,
          images: [document.querySelector('.rounded').src]
        }
      }
    })
    console.log(res);
    myAlert(true, '修改成功^~^')
    location.href = '../content/index.html'
  } catch (error) {
    myAlert(false, '修改失败#_# ' + error.response.data.message)
  }




})