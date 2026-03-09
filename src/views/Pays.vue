<script>
export default {
	name: 'PaysView'
}
</script>

<script setup>
import { onMounted, ref, watch } from 'vue'
import CardPays from '../components/CardPays.vue'

let pays = ref([])
let listeComplete = ref([])
let loading = ref(true)
let error = ref(null)
let recherche = ref('')
let showFlags = ref(true)
let selectedCountries = ref([])
let selectAll = ref(false)

// Données fictives pour tester le composant (même format que REST Countries API)
const mockCountries = [
	{
		cca3: 'FRA',
		name: { common: 'France' },
		capital: ['Paris'],
		region: 'Europe',
		population: 67750000,
		flags: { svg: 'https://flagcdn.com/fr.svg' }
	},
	{
		cca3: 'JPN',
		name: { common: 'Japan' },
		capital: ['Tokyo'],
		region: 'Asia',
		population: 123293512,
		flags: { svg: 'https://flagcdn.com/jp.svg' }
	},
	{
		cca3: 'BRA',
		name: { common: 'Brazil' },
		capital: ['Brasília'],
		region: 'Americas',
		population: 215313498,
		flags: { svg: 'https://flagcdn.com/br.svg' }
	},
	{
		cca3: 'CAN',
		name: { common: 'Canada' },
		capital: ['Ottawa'],
		region: 'Americas',
		population: 40533674,
		flags: { svg: 'https://flagcdn.com/ca.svg' }
	},
	{
		cca3: 'MAR',
		name: { common: 'Morocco' },
		capital: ['Rabat'],
		region: 'Africa',
		population: 37552994,
		flags: { svg: 'https://flagcdn.com/ma.svg' }
	},
	{
		cca3: 'AUS',
		name: { common: 'Australia' },
		capital: ['Canberra'],
		region: 'Oceania',
		population: 26068792,
		flags: { svg: 'https://flagcdn.com/au.svg' }
	},
	{
		cca3: 'IND',
		name: { common: 'India' },
		capital: ['New Delhi'],
		region: 'Asia',
		population: 1417173173,
		flags: { svg: 'https://flagcdn.com/in.svg' }
	},
	{
		cca3: 'DEU',
		name: { common: 'Germany' },
		capital: ['Berlin'],
		region: 'Europe',
		population: 83368221,
		flags: { svg: 'https://flagcdn.com/de.svg' }
	},
	{
		cca3: 'ARG',
		name: { common: 'Argentina' },
		capital: ['Buenos Aires'],
		region: 'Americas',
		population: 46044134,
		flags: { svg: 'https://flagcdn.com/ar.svg' }
	},
	{
		cca3: 'ZAF',
		name: { common: 'South Africa' },
		capital: ['Pretoria'],
		region: 'Africa',
		population: 60142978,
		flags: { svg: 'https://flagcdn.com/za.svg' }
	}
]

onMounted(async () => {
	try {
		// Essayer de récupérer depuis l'API
		const response = await fetch(
			'https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,cca3'
		)
		if (!response.ok) {
			throw new Error(`API indisponible. Utilisation de données fictives.`)
		}
		const data = await response.json()
		console.log('Données reçues de l\'API:', data)
		const sorted = data.sort((a, b) => a.name.common.localeCompare(b.name.common))
		listeComplete.value = sorted
		pays.value = sorted
	} catch (err) {
		console.warn('Impossible de récupérer les données de l\'API, utilisation des données fictives:', err)
		// Utiliser les données fictives en cas d'erreur
		const sorted = mockCountries.sort((a, b) => a.name.common.localeCompare(b.name.common))
		listeComplete.value = sorted
		pays.value = sorted
	} finally {
		loading.value = false
	}
})

// Méthode pour filtrer les pays en fonction de la recherche
function filtrer() {
	if (recherche.value.trim() === '') {
		// Si le champ de recherche est vide, afficher tous les pays
		pays.value = listeComplete.value
	} else {
		// Filtrer les pays dont le nom inclut la valeur de recherche (insensible à la casse)
		pays.value = listeComplete.value.filter(country =>
			country.name.common.toLowerCase().includes(recherche.value.toLowerCase())
		)
	}
}

// Observer pour filtrer en temps réel
watch(recherche, () => {
	filtrer()
})

// Méthode pour gérer la sélection/déselection de pays
function handleSelectCountry(payload) {
	const { countryId, countryName, isSelected } = payload
	if (isSelected) {
		if (!selectedCountries.value.includes(countryId)) {
			selectedCountries.value.push(countryId)
		}
		console.log(`${countryName} a été sélectionné. Total: ${selectedCountries.value.length}`)
	} else {
		const index = selectedCountries.value.indexOf(countryId)
		if (index > -1) {
			selectedCountries.value.splice(index, 1)
		}
		console.log(`${countryName} a été déselectionné. Total: ${selectedCountries.value.length}`)
	}
	// Mettre à jour le checkbox "Sélectionner tout"
	if (selectedCountries.value.length === pays.value.length) {
		selectAll.value = true
	} else {
		selectAll.value = false
	}
}

// Fonction pour gérer le clic sur le checkbox "Sélectionner tout"
function toggleSelectAll() {
	if (selectAll.value) {
		// Décocher: vider la sélection
		selectedCountries.value = []
		selectAll.value = false
		console.log(`Tous les pays ont été déselectionnés`)
	} else {
		// Cocher: sélectionner tous
		selectedCountries.value = pays.value.map(country => country.cca3)
		selectAll.value = true
		console.log(`Tous les ${pays.value.length} pays ont été sélectionnés`)
	}
}</script>

<template>
	<section class="pays">
		<div class="header">
			<h1>Liste des pays du monde</h1>
			<div v-if="!loading" class="search-bar">
				<input
					v-model="recherche"
					type="text"
					placeholder="Rechercher un pays..."
					class="search-input"
				/>
			</div>
		</div>
		
		<div v-if="loading" class="loading">
			<p>Chargement des données...</p>
		</div>

		<div v-else-if="error" class="error">
			<p>Erreur : {{ error }}</p>
		</div>

		<div v-else-if="pays.length > 0" class="countries-container">
			<div class="filter-options">
				<label class="checkbox-label">
					<input type="checkbox" :checked="selectAll" @change="toggleSelectAll" />
					Sélectionner tout
				</label>
				<label class="checkbox-label">
					<input type="checkbox" v-model="showFlags" />
					Afficher les drapeaux
				</label>
				<div class="selection-counter">
					{{ selectedCountries.length }} pays sélectionné{{ selectedCountries.length !== 1 ? 's' : '' }}
				</div>
			</div>
			<div class="cards-grid">
				<CardPays 
					v-for="country in pays" 
					:key="country.cca3" 
					:country="country" 
					:show-flags="showFlags"
					:is-selected="selectedCountries.includes(country.cca3)"
					@selectCountry="handleSelectCountry"
				/>
			</div>
		</div>
	</section>
</template>

<style scoped>
.pays {
	padding: 2rem;
	max-width: 1400px;
	margin: 0 auto;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 2rem;
	margin-bottom: 2rem;
}

.header h1 {
	margin: 0;
}

.search-bar {
	display: flex;
	gap: 1rem;
	width: 100%;
	max-width: 500px;
}

.search-input {
	flex: 1;
	padding: 1rem;
	font-size: 1.1rem;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	transition: border-color 0.3s;
}

.search-input:focus {
	outline: none;
	border-color: #0f766e;
}

.loading, .error {
	text-align: center;
	padding: 2rem;
	font-size: 1.1rem;
	color: #666;
}

.error {
	color: #d32f2f;
}

.countries-container {
	margin-top: 2rem;
}

.filter-options {
	margin-bottom: 1.5rem;
	display: flex;
	gap: 1rem;
	align-items: center;
}

.checkbox-label {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;
	user-select: none;
	font-size: 1rem;
}

.checkbox-label input[type="checkbox"] {
	cursor: pointer;
}

.selection-counter {
	padding: 0.75rem 1rem;
	background-color: #e0f2f1;
	border-radius: 4px;
	font-weight: 500;
	color: #00796b;
}

.cards-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1.5rem;
	margin-bottom: 2rem;
}

@media (max-width: 1200px) {
	.cards-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

@media (max-width: 900px) {
	.cards-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 600px) {
	.cards-grid {
		grid-template-columns: 1fr;
	}
}
</style>
