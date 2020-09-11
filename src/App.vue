<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view></router-view>
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Footer from "@/components/tools/Footer.vue";
import Navbar from "@/components/tools/Navbar.vue";

export default {
  name: "App",
  components: { Footer, Navbar },
};
</script>