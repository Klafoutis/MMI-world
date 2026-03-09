<script setup>
import { ref, watch } from 'vue'
import CardPays from '../components/CardPays.vue'

let recherche = ref('')
let resultats = ref([])
let loading = ref(false)
let error = ref(null)

// Observer pour rechercher en temps réel via l'API
watch(recherche, async (nouveauTerme) => {
	error.value = null
	resultats.value = []

	if (nouveauTerme.trim() === '') {
		loading.value = false
		return
	}

	loading.value = true
	try {
		const response = await fetch(
			`https://restcountries.com/v3.1/name/${encodeURIComponent(nouveauTerme)}`
		)
		if (!response.ok) {
			throw new Error('Aucun pays trouvé')
		}
		const data = await response.json()
		console.log('Résultats de la recherche:', data)
		// Trier les résultats par nom
		const sorted = data.sort((a, b) => a.name.common.localeCompare(b.name.common))
		resultats.value = sorted
	} catch (err) {
		console.error('Erreur lors de la recherche:', err)
		error.value = err.message
		resultats.value = []
	} finally {
		loading.value = false
	}
})
</script>

<template>
	<section class="recherche">
		<h1>Rechercher un pays</h1>
		
		<div class="search-bar">
			<input
				v-model="recherche"
				type="text"
				placeholder="Entrez le nom d'un pays..."
				class="search-input"
				autofocus
			/>
		</div>
		
		<div v-if="recherche.trim() === ''" class="empty-state">
			<p>Tapez le nom d'un pays pour commencer la recherche</p>
		</div>

		<div v-else-if="loading" class="loading">
			<p>Recherche en cours...</p>
		</div>

		<div v-else-if="error" class="error">
			<p>{{ error }}</p>
		</div>

		<div v-else-if="resultats.length > 0" class="countries-container">
			<p class="results-count">{{ resultats.length }} résultat(s) trouvé(s)</p>
			<div class="cards-grid">
				<CardPays v-for="country in resultats" :key="country.cca3" :country="country" />
			</div>
		</div>

		<div v-else class="no-results">
			<p>Aucun pays ne correspond à votre recherche</p>
		</div>
	</section>
</template>

<style scoped>
.recherche {
	padding: 2rem;
	max-width: 1400px;
	margin: 0 auto;
}

.search-bar {
	display: flex;
	gap: 1rem;
	margin-bottom: 2rem;
}

.search-input {
	flex: 1;
	max-width: 500px;
	padding: 0.75rem 1rem;
	font-size: 1rem;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	transition: border-color 0.3s;
}

.search-input:focus {
	outline: none;
	border-color: #0f766e;
}

.empty-state {
	text-align: center;
	padding: 3rem 2rem;
	color: #999;
	font-size: 1.1rem;
}

.loading, .error, .no-results {
	text-align: center;
	padding: 2rem;
	font-size: 1.1rem;
}

.loading {
	color: #666;
}

.error {
	color: #d32f2f;
	background-color: #ffebee;
	padding: 2rem;
	border-radius: 8px;
}

.no-results {
	color: #999;
	padding: 3rem 2rem;
}

.countries-container {
	margin-top: 2rem;
}

.results-count {
	color: #666;
	margin-bottom: 1.5rem;
	font-size: 0.95rem;
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
