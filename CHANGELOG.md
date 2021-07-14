# Change Log

## 3.0.0

Changelog 回归，从升级 antdv 2.2 开始了(commit id aa5e32dca3)，再前置的的变动不再列出了

- 🌟 升级 Vue 到 3.1，必须升级，这个版本的 vue 是有 breakchange 的，不然三方库不能使用，当然也意味着如果你还是用了其它 3.0 版本的第三库，是有可能跑步起来的
- 🌟 升级 antdv 到 2.2，必须升级，使用了 Vue 3.1 构建，在 vue 3.0 下是有问题的。这个版本同样也是有 breakchange，主要是菜单 Menu 组件，主要变动是，sub-menu, menu-item 必须提供 key，图标需要使用插槽配置，主要是这两个点
- 🌟 废弃 @ant-design-vue/use 库，useForm 合并入 antdv 中
- 🐞 升级 @surely-vue/table，修复 [#66](https://git.antdv.com/pro-vip/pro-vip/issues/66) [#64](https://git.antdv.com/pro-vip/pro-vip/issues/64)

## 2.0.1

- 🐞 修复多 Tab 右键关闭功能逻辑 [https://www.yuque.com/antdv-pro-vip/topics/10](https://www.yuque.com/antdv-pro-vip/topics/10)
- 🐞 修复布局设置抽屉切换语言不响应问题 [https://www.yuque.com/antdv-pro-vip/topics/12](https://www.yuque.com/antdv-pro-vip/topics/12)
- 🐞 修复子路由权限未校验问题
- 🐞 修复混合模式下 header menu 选中颜色错误问题 [https://www.yuque.com/antdv-pro-vip/topics/13](https://www.yuque.com/antdv-pro-vip/topics/13)
- 🐞 修复 Input-phone 组件，响应式绑定数据不正确问题
- 🌟 添加角色列表编辑功能

## 2.0.0

- 🌟 升级 eslint、prettier 等相关配置，让你的代码"看起来"更优雅
- 🌟 新增 husky，在代码提交前进行增量校验并格式化，如不需要，可在 package.json 中删除 husky 字段，强烈建议开启，可以有效避免低级错误，以及降低后续升级成本
- 🌟 暗黑主题配置, 使用说明 [https://www.yuque.com/antdv-pro-vip/resources/dfe9uh](https://www.yuque.com/antdv-pro-vip/resources/dfe9uh)
- 🌟 多标签新增，关闭左侧、关闭右侧、关闭其他 [https://www.yuque.com/antdv-pro-vip/dcl0vx/fks8ve](https://www.yuque.com/antdv-pro-vip/dcl0vx/fks8ve)
- 🌟 高级表单新增滚动到错误位置功能 [https://www.yuque.com/antdv-pro-vip/dcl0vx/etuq98](https://www.yuque.com/antdv-pro-vip/dcl0vx/etuq98)
- 🐞 修复验证码请求报错
- 🐞 修复左侧布局模二级菜单跟随滚动问题
- 🐞 修复高级表单吸底宽度没有跟随
- 🐞 修复图表在特殊情况下不更新的问题

由于该版本对底层依赖和格式化配置做了较大改动，所以直接使用 2.0 的版本号，如果你已经使用 1.0 版本，对于升级建议通过如下步骤降低升级成本： 1、优先更新 yarn.lock、package.json、.eslintrc.js、.prettierrc、.stylelintrc.js 等配置型文件 2、安装依赖 yarn --force 3、执行命令 npm run prettier、npm run lint 使用最新代码风格配置进行格式化 4、通过 vscode 进行目录对比代码，按需选择所需功能

## 1.0.2

- 🌟 未匹配路由跳转 404 页面
- 🐞 修复 1.0.1 引起的 base_url 报错问题

## 1.0.1

- 🌟 增加多 Tab 开关
- 🐞 固定 header 时，同步固定多 Tab
- 🌟 优化布局动画
- 🐞 设置抽屉切换布局主题时，图标闪动问题
- 🐞 header sidewidth 宽度没有同步 use-menu-state 问题
