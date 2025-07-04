<script>
import DataManager from "@/shared/components/data-manager.component.vue";
import { Concert } from "@/concerts/model/concert.entity.js";
import ConcertItemCreateAndEditComponent from "@/concerts/components/concert-item-create-and-edit.component.vue";
import { ConcertService } from "@/concerts/services/concert.services.js";

export default {
  name: "concert-management",
  components: { ConcertItemCreateAndEditComponent, DataManager },
  props: {
    searchQuery: String
  },
  data() {
    return {
      title: { singular: "Concert", plural: "Concerts" },
      concerts: [],
      concert: new Concert({}),
      selectedConcerts: [],
      concertService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
      selectedGenres: [],
      genres: ["Pop", "Rock", "K-pop", "Indie", "Urbano", "ElectrÃ³nica", "Salsa", "Cumbia", "Jazz"],
      currentUser: null
    };
  },
  computed: {
    filteredConcerts() {
      return this.concerts.filter(concert => {
        const matchesGenre = this.selectedGenres.length === 0 || this.selectedGenres.includes(concert.genre);
        const matchesSearch = this.searchQuery.trim() === '' ||
            concert.artistName.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchesGenre && matchesSearch;
      });
    },
    isArtist() {
      return this.currentUser && this.currentUser.type === 'artist';
    }
  },

  methods: {
    notifySuccessfulAction(message) {
      this.$toast.add({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    },
    findIndexById(id) {
      return this.concerts.findIndex(concert => concert.id === id);
    },
    onNewItem() {
      this.concert = new Concert({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    onEditItem(item) {
      this.concert = new Concert(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    onDeleteItem(item) {
      this.concert = { ...item };
      this.deleteConcert();
    },
    onDeleteSelectedItems(selectedItems) {
      this.selectedConcerts = selectedItems;
      this.deleteSelectedConcerts();
    },
    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },
    onSaveRequested(item) {
      this.submitted = true;
      if (item.artistName && item.artistName.trim()) {
        if (item.id) {
          this.updateConcert(item);
        } else {
          this.createConcert(item);
        }
        this.createAndEditDialogIsVisible = false;
        this.isEdit = false;
      }
    },
    createConcert(item) {
      const concertToSend = {
        id: item.id,
        artist: [{ name: item.artistName, genre: item.genre }],
        image: item.image,
        description: item.description,
        date: item.date,
        venue: {
          name: item.venueName,
          address: item.venueAddress,
          location: {
            lat: 0,
            lng: 0
          }
        },
        status: item.status || 'Disponible'
      };

      this.concertService.create(concertToSend).then(response => {
        const concert = new Concert(response.data);
        this.concerts.push(concert);
        this.notifySuccessfulAction("Concierto creado correctamente");
      }).catch(error => {
        console.error('Error al crear el concierto', error);
      });
    },
    updateConcert(item) {
      const updatedConcert = {
        id: item.id,
        artist: [{ name: item.artistName, genre: item.genre }],
        image: item.image,
        description: item.description,
        date: item.date,
        venue: {
          name: item.venueName,
          address: item.venueAddress,
          location: {
            lat: 0,
            lng: 0
          }
        },
        status: item.status || 'Disponible'
      };

      this.concertService.update(item.id, updatedConcert).then(response => {
        const index = this.findIndexById(item.id);
        this.concerts[index] = new Concert(response.data);
        this.notifySuccessfulAction("Concierto actualizado");
      }).catch(error => console.error('Error al actualizar', error));
    },
    deleteConcert() {
      this.concertService.delete(this.concert.id).then(() => {
        let index = this.findIndexById(this.concert.id);
        this.concerts.splice(index, 1);
        this.notifySuccessfulAction("concert Deleted");
      }).catch(error => console.error(error));
    },
    deleteSelectedConcerts() {
      this.selectedConcerts.forEach((concert) => {
        this.concertService.delete(concert.id).then(() => {
          this.concert = this.concerts.filter((t) => t.id !== this.concert.id);
        });
      });
      this.notifySuccessfulAction("concert Deleted");
    }
  },
  created() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
    this.concertService = new ConcertService();

    this.concertService.getAll().then(response => {
      this.concerts = response.data.map(c => new Concert(c));
    }).catch(error => console.error('Error al cargar concert ', error));
  }
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-content-between align-items-center mb-4" style="margin-left: 1.5rem;">
      <h2 class="text-2xl">Conciertos</h2>
      <pv-button
          v-if="isArtist"
          label="Nuevo concierto"
          icon="pi pi-plus"
          severity="success"
          @click="onNewItem"
          style="background-color: #CB6CE6; border-radius: 25px; border: none; color: white; font-weight: bold;"
      />
    </div>

    <div class="concerts-filter-container">
      <div class="filter-container">
        <div class="filter-header"><span>Filtrar</span></div>
        <div class="filter-options">
          <label v-for="genre in genres" :key="genre" class="checkbox-label">
            <input type="checkbox" :value="genre" v-model="selectedGenres" />
            {{ genre }}
          </label>
        </div>
      </div>

      <div class="concerts-grid">
        <router-link
            v-for="concert in filteredConcerts"
            :key="concert.id"
            :to="`/concerts/${concert.id}`"
            class="concert-card"
        >
          <img :src="concert.image" :alt="concert.artistName" />
          <div class="concert-info">
            <h3>{{ concert.artistName }}</h3>
            <p>{{ concert.date }}, {{ concert.venueName }}</p>
          </div>
        </router-link>
      </div>
    </div>

    <concert-item-create-and-edit-component
        :edit="isEdit"
        :item="concert"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />
  </div>
</template>

<style scoped>
.concerts-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.concert-card {
  background-color: #1a1a1a;
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  width: 240px;
  cursor: pointer;
  transition: transform 0.2s;
  color: white;
}

.concert-card:hover {
  transform: scale(1.03);
}

.concert-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.concert-info {
  padding: 0.8rem;
}
</style>
