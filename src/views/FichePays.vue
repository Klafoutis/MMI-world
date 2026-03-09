<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const paysData = ref(null)
const borderCountries = ref({})
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const cca3 = route.params.id
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${cca3}`
    )
    if (!response.ok) {
      throw new Error('Pays non trouvé')
    }
    const data = await response.json()
    // L'API retourne un array, on prend le premier élément
    paysData.value = Array.isArray(data) ? data[0] : data
    console.log('Données du pays:', paysData.value)

    // Récupérer les noms des pays frontaliers
    if (paysData.value?.borders && paysData.value.borders.length > 0) {
      try {
        const borderCodes = paysData.value.borders.join(',')
        console.log('Codes des pays frontaliers:', borderCodes)
        const borderResponse = await fetch(
          `https://restcountries.com/v3.1/alpha?codes=${borderCodes}&fields=name,cca3,cca2,ccn3`
        )
        if (borderResponse.ok) {
          const borderData = await borderResponse.json()
          console.log('Réponse API pays frontaliers:', borderData)
          borderData.forEach(country => {
            const code = country.cca3 || country.cca2 || borderCodes
            borderCountries.value[code] = country.name.common
            console.log(`Ajout: ${code} => ${country.name.common}`)
          })
          console.log('Noms des pays frontaliers finaux:', borderCountries.value)
        } else {
          console.error('Erreur API border response:', borderResponse.status)
        }
      } catch (borderErr) {
        console.warn('Erreur lors de la récupération des noms des pays frontaliers:', borderErr)
      }
    } else {
      console.log('Pas de pays frontaliers trouvés')
    }
  } catch (err) {
    error.value = err.message
    console.error('Erreur lors de la récupération des données:', err)
  } finally {
    loading.value = false
  }
})

const cca3 = computed(() => route.params.id)

// Fonction utilitaire pour formater les nombres
const formatNumber = (num) => {
  if (!num) return 'N/A'
  return num.toLocaleString('fr-FR')
}

// Fonction pour obtenir les langues
const getLanguages = () => {
  if (!paysData.value?.languages) return 'N/A'
  return Object.values(paysData.value.languages).join(', ')
}

// Fonction pour obtenir la devise
const getCurrency = () => {
  if (!paysData.value?.currencies) return 'N/A'
  return Object.entries(paysData.value.currencies)
    .map(([code, curr]) => `${curr.name} (${code})`)
    .join(', ')
}

// Fonction pour obtenir la superficie
const getArea = () => {
  if (!paysData.value?.area) return 'N/A'
  return `${formatNumber(paysData.value.area)} km²`
}

// Fonction pour obtenir les noms des pays frontaliers
const getBorderCountriesNames = () => {
  if (!paysData.value?.borders || paysData.value.borders.length === 0) {
    return 'Aucun (île)'
  }
  console.log('Fonction appelée - borders:', paysData.value.borders)
  console.log('borderCountries disponibles:', borderCountries.value)
  
  const names = paysData.value.borders
    .map(code => {
      const name = borderCountries.value[code]
      console.log(`Code: ${code} => Name trouvé: ${name}`)
      return name || code
    })
    .join(', ')
  
  console.log('Résultat final:', names)
  return names
}
</script>

<template>
  <section class="fiche-pays">
    <router-link class="back" :to="{ name: 'pays' }">← Retour à la liste</router-link>
    
    <div v-if="loading" class="loading">
      <p>Chargement des données...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>Erreur : {{ error }}</p>
      <p v-if="cca3">Code pays demandé : {{ cca3 }}</p>
    </div>

    <div v-else-if="paysData" class="content">
      <div class="header">
        <div class="flag-container">
          <img v-if="paysData.flags?.svg" :src="paysData.flags.svg" :alt="'Drapeau de ' + paysData.name?.common" class="flag" />
        </div>
        <div class="title-section">
          <h1>{{ paysData.name?.common }}</h1>
          <p class="official-name" v-if="paysData.name?.official">{{ paysData.name.official }}</p>
        </div>
      </div>

      <div class="details-grid">
        <div class="detail-card">
          <h3>Capitale</h3>
          <p>{{ paysData.capital?.join(', ') || 'N/A' }}</p>
        </div>

        <div class="detail-card">
          <h3>Région</h3>
          <p>{{ paysData.region || 'N/A' }}</p>
        </div>

        <div class="detail-card">
          <h3>Sous-région</h3>
          <p>{{ paysData.subregion || 'N/A' }}</p>
        </div>

        <div class="detail-card">
          <h3>Population</h3>
          <p>{{ formatNumber(paysData.population) }} habitants</p>
        </div>

        <div class="detail-card">
          <h3>Superficie</h3>
          <p>{{ getArea() }}</p>
        </div>

        <div class="detail-card">
          <h3>Langues officielles</h3>
          <p>{{ getLanguages() }}</p>
        </div>

        <div class="detail-card">
          <h3>Devise(s)</h3>
          <p>{{ getCurrency() }}</p>
        </div>

        <div class="detail-card">
          <h3>Fuseau horaire</h3>
          <p>{{ paysData.timezones?.join(', ') || 'N/A' }}</p>
        </div>
      </div>

      <div class="extra-info" v-if="paysData.borders">
        <div v-if="paysData.borders" class="info-section">
          <h3>Pays frontaliers</h3>
          <p>{{ getBorderCountriesNames() }}</p>
        </div>
      </div>
    </div>

    <template v-else>
      <p>Pays introuvable</p>
    </template>
  </section>
</template>

<style scoped>
.fiche-pays {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.back {
  display: inline-block;
  margin-bottom: 2rem;
  color: #0f766e;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
}

.back:hover {
  text-decoration: underline;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #666;
}

.error {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 2rem;
  border-radius: 8px;
}

.header {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: flex-start;
}

.flag-container {
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.flag {
  width: 250px;
  height: 150px;
  object-fit: cover;
  display: block;
}

.title-section h1 {
  margin: 0;
  font-size: 2.5rem;
  color: #1a1a1a;
}

.official-name {
  color: #666;
  font-size: 1.1rem;
  margin-top: 0.5rem;
  font-style: italic;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-card {
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #0f766e;
}

.detail-card h3 {
  margin: 0 0 0.75rem 0;
  color: #0f766e;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-card p {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.extra-info {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.info-section {
  margin-bottom: 1.5rem;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section h3 {
  color: #0f766e;
  margin: 0 0 1rem 0;
}

.info-section p {
  color: #555;
  margin: 0.5rem 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }

  .flag {
    width: 100%;
    height: auto;
  }

  .title-section h1 {
    font-size: 2rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
