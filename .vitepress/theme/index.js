import DefaultTheme from 'vitepress/theme'
import AnotherCustomComponent from '@/components/test/AnotherCustomComponent.vue'
import MyCustomComponent from '@/components/test/MyCustomComponent.vue'
import Blog from './components/blog/index.vue'
import Home from './components/home/index.vue'
import Layout from './components/Layout.vue'
import './assets/styles/index.css'
import 'virtual:uno.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('Home', Home)
    app.component('BlogIndex', Blog)
    app.component('MyCustomComponent', MyCustomComponent)
    app.component('AnotherCustomComponent', AnotherCustomComponent)
  },
}
