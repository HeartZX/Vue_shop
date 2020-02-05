import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Footer, Main, Aside, Table, TableColumn, Switch, Pagination, MessageBox, Tree, Select, Option, Cascader, Tabs, TabPane, Tag, InputNumber, Checkbox, CheckboxGroup, Upload, Timeline, TimelineItem } from 'element-ui'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.use(Antd)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
Vue.use(Container)
Vue.use(Header)
Vue.use(Footer)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(InputNumber)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
