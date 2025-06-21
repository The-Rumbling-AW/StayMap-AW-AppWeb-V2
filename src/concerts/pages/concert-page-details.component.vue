<script>
import { ConcertService } from '@/concerts/services/concert.services.js';
import { Concert } from '@/concerts/model/concert.entity.js';
import { UserService } from '@/users/services/user.service.js';

export default {
  name: 'ConcertPageDetails',
  data() {
    return {
      concert: new Concert({}),
      user: null,
      isAttending: false,
      userService: new UserService()
    };
  },
  created() {
    const concertId = this.$route.params.id;
    const concertService = new ConcertService();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }

    concertService.getById(concertId)
        .then(res => {
          this.concert = new Concert(res.data);
          this.checkAttendance();
        })
        .catch(error => {
          console.error("Error cargando detalles del concierto:", error);
        });
  },
  methods: {
    checkAttendance() {
      if (!this.user || !Array.isArray(this.user.upcomingConcerts)) {
        this.isAttending = false;
        return;
      }
      this.isAttending = this.user.upcomingConcerts.includes(this.concert.id);
    },
    toggleAttendance() {
      if (!this.user || !this.concert.id) return;

      const index = this.user.upcomingConcerts.indexOf(this.concert.id);
      if (index >= 0) {
        this.user.upcomingConcerts.splice(index, 1);
        this.isAttending = false;
      } else {
        this.user.upcomingConcerts.push(this.concert.id);
        this.isAttending = true;
      }

      this.userService.update(this.user.id, this.user)
          .then(() => {
            localStorage.setItem("user", JSON.stringify(this.user));
            this.$toast.add({
              severity: 'success',
              summary: 'Asistencia actualizada',
              detail: this.isAttending ? 'Asistencia confirmada' : 'Asistencia cancelada',
              life: 3000
            });
          })
          .catch(error => {
            console.error('Error al actualizar asistencia:', error);
          });
    }
  }
};
</script>

<template>
  <div class="concert-detail-page">
    <div class="header-section">
      <img :src="concert.image" :alt="concert.artistName" class="banner-img" />
      <div class="details-conatiner-info">
        <div class="concert-info">
          <h1 class="title">¡{{ concert.artistName }} llega a Lima!</h1>
          <p class="description">{{ concert.description }}</p>
          <div class="venue-section">
            <h3>📍 Lugar: {{ concert.venueName }}</h3>
            <p>{{ concert.date }} - {{ concert.venueAddress }}</p>
          </div>
        </div>

        <div class="button-group">
          <pv-button
              :label="isAttending ? 'Cancelar asistencia' : 'Confirmar asistencia'"
              class="button"
              severity="plain"
              @click="toggleAttendance"
          />
          <pv-button label="Comprar entradas" class="button" severity="plain" />
        </div>
      </div>
    </div>

    <div class="fan-section">
      <h4 class="fan-header">Comunidad de fans</h4>
      <div class="fan-container">
        <p>
          Conoce a <span class="highlight">fans</span> que
          <span class="highlight">asistirán</span> al concierto
        </p>
        <div class="fan-list">
          <span v-for="n in 15" :key="n" class="fan-handle">@fan{{ n }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.concert-detail-page {
  padding: 2rem;
  color: white;
  background-color: #000000;


}

.header-section {
  display: flex;
  align-items: center;
  margin-bottom: 7rem;
}

.details-conatiner-info{
  margin-left: 5rem;

}

.banner-img {
  border-radius: 20px;
  height: 25rem;
  max-width: 50%;
  object-fit: cover;
}

.concert-info {

  text-align: center;
}

.title {
  font-size: 2rem;
  font-weight: bold;

}


.description {
  margin: 1rem 0;
  font-size: 1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  text-align: justify;
}

.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

}


.button {
  width: 300px;
  background-color: #000000;
  border: 2px solid #CB6CE6;
  color: white;
  border-radius: 20px;
  padding: 0.5rem 1rem;
}

.venue-section {
  margin-top: 2rem;
  text-align: center;
}

.fan-section {

  margin-top: 2rem;
  text-align: center;
}
.fan-container {
  display: flex;
}
.fan-container p{
  margin-left: 5rem;
  font-size: 1.5rem;
}

.fan-header {
  background-color: #CB6CE6;
  color: black;
  padding: 0.5rem;
  box-shadow: 0 0 10px #CB6CE6;
  width: 100%;
}

.highlight {
  color: #CB6CE6;
  font-weight: bold;
}

.fan-list {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  background-color: #1a1a1a;
  border-radius: 20px;
  margin-left: 9rem;
  margin-right: 4rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 1rem 0;

}

.fan-handle {
  background-color: #1a1a1a;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

</style>
