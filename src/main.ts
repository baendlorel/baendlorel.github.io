import './styles/app.css';
import './styles/icons.css';
import { mount } from 'svelte';
import App from './App.svelte';

// fixme 有的rollup背景渐变色不对
// todo 根据purpose来做分类
const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
