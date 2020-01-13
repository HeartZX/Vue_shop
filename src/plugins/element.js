import Vue from 'vue'
import { Button } from 'element-ui'
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
import { Message } from 'element-ui'
import { Container, Header, Footer, Main, Aside } from 'element-ui'
import { Table } from 'element-ui'
import { TableColumn } from 'element-ui'
import { Switch } from 'element-ui'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import { Pagination } from 'element-ui'
import { MessageBox } from 'element-ui'
import { Tree } from 'element-ui'
import { Select } from 'element-ui'
import { Option } from 'element-ui'
import { Cascader } from 'element-ui'
import { Tabs } from 'element-ui'
import { TabPane } from 'element-ui'
import { Tag } from 'element-ui'
import { InputNumber } from 'element-ui'
import { Checkbox } from 'element-ui'
import { CheckboxGroup } from 'element-ui'
import { Upload } from 'element-ui'
import { Timeline,TimelineItem } from 'element-ui'


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

