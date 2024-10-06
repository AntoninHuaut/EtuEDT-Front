<template>
  <v-card elevation="5" :width="Math.min(width, 830)" class="mt-3 mx-auto">
    <v-card-item class="mx-1 my-3">
      <v-card-title class="text-primary mb-2 text-wrap">Synchronisation avec des services tiers</v-card-title>
      <v-card-subtitle class="text-wrap">
        L'application vous permet de synchroniser automatiquement votre emploi du temps avec un service tier, si celui-ci
        supporte l'ajout de calendrier externe par URL.
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <p class="text-subtitle-2 mb-1">Exemple avec Google et Outlook :</p>
      <div>
        <ol>
          <li>
            Rendez-vous sur la page de consultation de l'EDT, et cliquez sur l'icône
            <span class="infos">
              <v-icon icon="mdi-link" />
              pour obtenir le lien de synchronisation de l'EDT votre presse-papier.
            </span>
          </li>
          <li>
            Rendez-vous sur <a href="https://calendar.google.com/">Google Agenda</a> ou sur <a href="https://outlook.com/">Outlook</a>
            (onglet Calendrier).
          </li>
          <li>Grâce au menu situé à gauche, déclarez un nouvel emploi du temps :
            <ul>
              <li>
                <span class="text-primary">Google</span> :
                <span class="text-subtitle-2">"Autres agendas +"</span> puis <span class="text-subtitle-2">"À partir de l'URL"</span>.
              </li>
              <li>
                <span class="text-primary">Outlook</span> :
                <span class="text-subtitle-2">"Ajouter un calendrier"</span> puis <span class="text-subtitle-2">"S'abonner à partir du
                  web"</span>.
              </li>
            </ul>
          </li>
          <li>Copiez l'URL que vous avez dans votre presse-papier et validez.</li>
          <li>Votre emploi du temps est maintenant synchronisé, les fréquences de mise à jour sont variables et peuvent prendre plusieurs
            heures suivant le service utilisé.</li>
        </ol>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";

const { width } = useDisplay();
</script>

<style scoped>
ol {
  line-height: 2;
}

li {
  margin-left: 0.75rem;
  margin-right: 0.75rem;
  margin-bottom: 0.5rem;
}
</style>
