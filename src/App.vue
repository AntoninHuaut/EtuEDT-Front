<template>
  <v-app>
    <Navbar />
    <v-content>
      <router-view></router-view>
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import Footer from "@/components/tools/Footer.vue";
import Navbar from "@/components/tools/Navbar.vue";

export default {
  name: "App",
  components: { Footer, Navbar }
};
</script>