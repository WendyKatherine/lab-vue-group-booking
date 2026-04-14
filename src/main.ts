import { createApp } from 'vue'
import App from './App.vue'
import { router } from './app/router'

import "@wendy/retro-tech-foundation/css/core.css";
import "@wendy/retro-tech-foundation/css/web.css";
import "@wendy/retro-tech-foundation/css/recipes.css";
import "@wendy/retro-tech-foundation/css/themes/phosphor.css";
import "@wendy/retro-tech-foundation/css/themes/ivory.css";
import "@wendy/retro-tech-foundation/css/themes/bigblue.css";

import "./styles/app.css";

createApp(App).use(router).mount('#app')
