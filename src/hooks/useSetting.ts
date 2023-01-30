import { reactive, toRefs } from 'vue'
import { Theme } from '../types/index'

interface State {
  collapsed: boolean,
  theme: Theme,
  device: 'pc'|'mobile'|null
}

const initialState = reactive<State>({
  collapsed: false,
  theme: Theme.dark,
  device: null
})

const setCollapse = (collapse:boolean) => {
  initialState.collapsed = collapse
}

const setTheme = (theme: Theme) => {
  initialState.theme = theme
}

const fontSize = ref(16)

const { width } = useWindowSize()

const setFontsize = () => {
  if (width.value >= 750) {
    const dpr = width.value / 1280
    fontSize.value = 16 * dpr
    document.documentElement.style.fontSize = 16 * dpr + 'px'
  }
  if (width.value < 750 && width.value >= 360) {
    const dpr = width.value / 375
    document.documentElement.style.fontSize = 16 * dpr + 'px'
  }
}

const isMobile = () => {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  const getArr = Agents.filter(i => userAgentInfo.includes(i))
  initialState.device = (getArr.length) ? 'mobile' : 'pc'
  return !!getArr.length
}

export default function() {
  return {
    ...toRefs(initialState),
    setCollapse,
    setTheme,
    setFontsize,
    isMobile,
    Theme,
    fontSize
  }
}
