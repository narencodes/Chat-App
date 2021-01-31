<template>
  <section class="h100">
    <router-view/>
  </section>
</template>

<script>
import { FONT_AWESOME_URL } from "@/utility/constants";

export default {
  name : "App",
  
  beforeMount () {
    window.onload = () => this.appendFontScript();
  },
  
  methods: {
    appendFontScript() {
      let script = document.createElement('script');
      script.id = 'font_awesome';
      script.src = FONT_AWESOME_URL;
      document.head.appendChild(script);
    }
  },
}
</script>
