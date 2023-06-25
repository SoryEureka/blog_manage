// 富文本编辑器
// 解构获取  创建编辑器函数 ，和 工具栏函数
const { createEditor, createToolbar } = window.wangEditor

// 编辑器配置对象
const editorConfig = {
    placeholder: '请输入内容吧(oﾟ▽ﾟ)o  ...',
    onChange(editor) {
        // 获取富文本内容
      const html = editor.getHtml()
      // console.log('editor content', html)
      // 也可以同步到 <textarea>
    //   为了后学快速收集整个表单内容做铺垫
      document.querySelector('.publish-content').value=html
    }
}

// 创建编辑器
const editor = createEditor({
    // 创建位置
    selector: '#editor-container',
    // 设置编辑器默认内容
    html: '<p><br></p>',
    // 配置项
    config: editorConfig,
    // 配置集成模式  （default全部） 和 （simple 简结）两种模式
    mode: 'default', // or 'simple'
})

// 工具栏配置对象 自己增删工具
const toolbarConfig = {}

// 创建工具栏
const toolbar = createToolbar({
    // 为指定编辑器创建工具栏
    editor,
    // 工具栏创建的位置
    selector: '#toolbar-container',
    // 工具栏配置值对象
    config: toolbarConfig,
    // 配置集成模式  （default全部） 和 （simple 简结）两种模式
    mode: 'default', // or 'simple'
})


// 创建编辑器函数，创建工具栏函数