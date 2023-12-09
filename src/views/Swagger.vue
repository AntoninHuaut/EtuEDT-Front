<template>
  <div id="swagger"></div>
</template>

<script>
import SwaggerUI from "swagger-ui";
import "@/assets/swagger-ui.css";

export default {
  name: "Swagger",
  mounted: () => {
    SwaggerUI({
      dom_id: "#swagger",
      url: "https://edtapi.antoninhuaut.fr/openapi",
    });
  }
};
</script>

<style>
div.swagger-ui>div>div>section>div>div.info {
  background-color: white !important;
  border-color: white !important;
}
</style>