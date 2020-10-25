import Vue from "vue";
import HelloWorld from "./helloWorld.vue";

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  render: h=>h(HelloWorld)
});