import { mount } from 'svelte';
import './styles/app.css';
import App from './App.svelte';

const app = mount(App, {
  target: document.getElementById('app')!,
});

if (__IS_DEV__) {
  console.log('Development mode: LocalStorage cleared');
  localStorage.clear();
}

export default app;
