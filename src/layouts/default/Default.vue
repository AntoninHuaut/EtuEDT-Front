<template>
  <div class="box">
    <v-app>
      <div class="row header">
        <DefaultBar />
      </div>

      <div class="row content">
        <DefaultView />
      </div>

      <div class="row footer">

        <FooterBar />
      </div>
    </v-app>
  </div>
</template>

<script lang="ts" setup>
import DefaultBar from "./AppBar.vue";
import FooterBar from "./FooterBar.vue";
import DefaultView from "./View.vue";
</script>

<style>
.box {
  display: flex;
  flex-flow: column;
  height: 100%;
}

.box .row {
  border: 1px dotted grey;
}

.box .row.header {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}

.box .row.content {
  flex: 1 1 auto;
}

.box .row.footer {
  flex: 0 1 40px;
}
</style>