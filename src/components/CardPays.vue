<script setup>
import { useRouter } from 'vue-router'
import { watch, ref } from 'vue'

const props = defineProps({
  country: {
    type: Object,
    required: true
  },
  showFlags: {
    type: Boolean,
    default: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['selectCountry'])

const localSelected = ref(false)
const isUpdatingFromParent = ref(false)

// Surveiller les changements de la prop showFlags
watch(() => props.showFlags, (newValue, oldValue) => {
  console.log(`showFlags changé de ${oldValue} à ${newValue}`)
})

// Surveiller les changements de la prop isSelected (venant du parent)
watch(() => props.isSelected, (newValue) => {
  isUpdatingFromParent.value = true
  localSelected.value = newValue
})

// Surveiller les changements de la sélection locale
watch(localSelected, (newValue) => {
  if (!isUpdatingFromParent.value) {
    console.log(`${props.country.name.common} ${newValue ? 'sélectionné' : 'désélectionné'}`)
    emit('selectCountry', { countryId: props.country.cca3, countryName: props.country.name.common, isSelected: newValue })
  } else {
    isUpdatingFromParent.value = false
  }
})

const router = useRouter()

const navigateToPays = () => {
  router.push({
    name: 'fiche-pays',
    params: { id: props.country.cca3 }
  })
}

const handleCheckboxClick = (event) => {
  event.stopPropagation()
}
</script>

<template>
  <div class="card-pays" :class="{ selected: localSelected }" @click="navigateToPays">
    <div class="selection-container">
      <label class="selection-checkbox">
        <input type="checkbox" v-model="localSelected" @click="handleCheckboxClick" />
      </label>
    </div>
    <div v-if="showFlags" class="flag-container">
      <img v-if="props.country.flags.svg" :src="props.country.flags.svg" :alt="'Drapeau de ' + props.country.name.common" class="flag" />
    </div>
    <div class="content">
      <h3>{{ props.country.name.common }}</h3>
      <p v-if="props.country.capital">
        <strong>Capitale :</strong> {{ props.country.capital.join(', ') }}
      </p>
      <p v-if="props.country.region">
        <strong>Région :</strong> {{ props.country.region }}
      </p>
      <p v-if="props.country.population">
        <strong>Population :</strong> {{ (props.country.population / 1000000).toFixed(1) }}M
      </p>
    </div>
  </div>
</template>

<style scoped>
.card-pays {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.card-pays.selected {
  background-color: #c8e6c9;
  border-color: #43a047;
  box-shadow: 0 4px 8px rgba(67, 160, 71, 0.3);
}

.card-pays:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.flag-container {
  width: 100%;
  height: 150px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.flag {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-pays h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
}

.card-pays p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.card-pays strong {
  color: #333;
}

.selection-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  background-color: white;
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.selection-checkbox {
  display: flex;
  cursor: pointer;
}

.selection-checkbox input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.card-pays {
  position: relative;
}
</style>
