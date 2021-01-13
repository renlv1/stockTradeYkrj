import Vue from 'vue'
import {
  Input,
  Pagination,
  Dialog,
  Radio,
  RadioGroup,
  Switch,
  Select,
  Option,
  Upload,
  MessageBox,
  Message,
  Loading,
  Popover,
  Tabs,
  TabPane,
  CheckboxGroup,
  Checkbox,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  TimePicker,
  DatePicker,
  Progress,
  Tooltip,
} from 'element-ui'

import en from 'element-ui/lib/locale/lang/en'
import es from 'element-ui/lib/locale/lang/es'
import locale from 'element-ui/lib/locale'

let lang = localStorage.getItem('lang')
if (lang) {
  lang = lang.toLowerCase()
  if (lang === 'en') {
    locale.use(en)
  } else if (lang === 'es') {
    locale.use(es)
  }
}

// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.component(CollapseTransition.name, CollapseTransition)

Vue.use(Input)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Upload)
Vue.use(Popover)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(TimePicker)
Vue.use(DatePicker)
Vue.use(Progress)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tooltip)
Vue.use(Loading.directive);

Vue.directive('focus', {
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$msgbox = MessageBox
