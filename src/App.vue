<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <router-link to="/">
          <v-img
            alt="EtuEDT Logo"
            class="shrink mr-2"
            contain
            src="/favicon.ico"
            transition="scale-transition"
            width="40"
          />
        </router-link>

        <router-link to="/">
          <span class="white--text title font-weight-regular">Accueil</span>
        </router-link>
      </div>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>
