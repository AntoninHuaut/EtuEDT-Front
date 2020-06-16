<template>
  <div class="faq">
    <v-card elevation="6" class="mt-5 mx-auto" max-width="750" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="blueC headline mb-1 text-wrap">Synchroniser avec Google Agenda</v-list-item-title>
          <v-list-item-subtitle
            class="text-wrap"
          >L'application permet de synchroniser automatiquement votre emploi du temps</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-card-text>
        <div class="text--primary">
          <ol>
            <li>
              Rendez-vous sur la page de consultation de l'EDT, et cliquez sur l'icone
              <span
                class="infos"
              >
                <v-icon>mdi-link</v-icon>
                <br />Le lien contenant les informations de l'EDT va être copié dans votre presse-papier
              </span>
            </li>
            <li>
              Rendez-vous sur
              <a href="https://calendar.google.com/">Google Agenda</a>
            </li>
            <li>
              Ajoutez un nouvel emploi du temps via cette catégorie :
              <img
                class="alignCenter"
                src="https://i.imgur.com/93ipZJK.png"
                alt="Icône '+' à côté de 'Autres agendas'"
              />
              <span class="infos">
                <br />Vous devez choisir la sous-catégorie : "À partir de l'URL"
              </span>
            </li>
            <li>Copiez l'URL que vous avez dans votre presse-papier et validez</li>
          </ol>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "FAQ"
};
</script>

<style scoped>
.alignCenter {
  vertical-align: middle;
}

.blueC {
  color: #007bff;
}

.infos {
  color: rgb(78, 78, 78);
  font-size: 90%;
  font-style: italic;
}

h3 {
  font-size: 27px;
  margin: 20px;
  margin-top: 50px;
}

ol {
  line-height: 2;
}
</style>