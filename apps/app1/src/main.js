import Vue from 'vue'
import router from './router';
import App from './App.vue'

Vue.config.productionTip = false
const app = new Vue({
  router,
  render: h => h(App),
})

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  console.log('mount', props);
  app.$mount(props.container && props.container.querySelector('#app') || '#app');
}

export async function unmount(props) {
  console.log('unmount', props);
  app.$destroy();
}

export async function update(props) {
  console.log('update', props);
}
