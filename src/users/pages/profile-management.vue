<script>
import { ConcertService } from "@/concerts/services/concert.services.js";
import { User } from "@/users/model/user.entity.js";
import EditProfile from "@/users/components/edit-profile.component.vue";
import {UserService} from "@/users/services/user.service.js";

export default {
  name: "profile-management",
  components: {EditProfile},
  data() {
    return {
      user: null,
      allConcerts: [],
      upcomingConcerts: [],
      attendedConcerts: [],
      concertService: new ConcertService(),
      editDialogVisible: false,// agregue esto
      userService: new UserService(),// agregue esto

    };
  },
  async mounted() {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      this.user = new User(JSON.parse(storedUser));

      // Asegurar que existan los arrays
      this.user.upcomingConcerts ??= [];
      this.user.attendedConcerts ??= [];

      const concerts = await this.concertService.getAllConcerts();
      this.allConcerts = concerts;

      console.log("User upcomingConcerts:", this.user.upcomingConcerts);
      console.log("Concert IDs:", concerts.map(c => c.id));

      // Filtrar conciertos según los IDs del usuario
      this.upcomingConcerts = concerts.filter(c =>
          this.user.upcomingConcerts.includes(c.id)
      );

      this.attendedConcerts = concerts.filter(c =>
          this.user.attendedConcerts.includes(c.id)
      );

      // Debug adicional
      console.log("Matches upcoming:", this.upcomingConcerts);
      console.log("Matches attended:", this.attendedConcerts);
    }
  },
  methods: {
    //para que se actualice el backend
    async handleSave(updatedUser) {
      try {
        await this.userService.update(updatedUser.id, updatedUser);
        this.user = updatedUser;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.editDialogVisible = false;
        this.$toast.add({severity: 'success', summary: 'Perfil actualizado', life: 3000});
      } catch (err) {
        this.$toast.add({severity: 'error', summary: 'Error al actualizar', detail: err.message});
      }
    }
  }
};

</script>



<template>
  <div class="profile-container">
    <div v-if="user" class="profile-card">
      <div class="profile-info">
        <h1><strong>Tipo:</strong> {{ user.type === 'fan' ? 'Fan' : 'Artista' }}</h1>
        <img :src="user.profileImage || 'https://via.placeholder.com/100'" alt="Foto de perfil" class="profile-img" />
        <p>{{ user.name }}</p>
        <p class="profile-email-info">{{ user.email }}</p>
        <button class="edit-button" @click="editDialogVisible = true">Editar perfil</button>
        <edit-profile
            :user="user"
            :visible="editDialogVisible"
            @cancel-requested="editDialogVisible = false"
            @save-requested="handleSave"
        />
      </div>

      <div class="profile-concert-to-attended">
        <h1><strong>Conciertos por Asistir</strong></h1>
        <p v-if="upcomingConcerts.length === 0">No tienes conciertos pendientes.</p>
        <router-link
            v-for="concert in upcomingConcerts"
            :key="'upcoming-' + concert.id"
            :to="`/concerts/${concert.id}`"
            class="concert-link"
        >
          {{ concert.artistName }} - {{ concert.date }}
        </router-link>

      </div>

      <div class="profile-concert-attended">
        <h1><strong>Conciertos Asistidos</strong></h1>
        <p v-if="attendedConcerts.length === 0">Aún no has asistido a ningún concierto.</p>
        <router-link
            v-for="concert in attendedConcerts"
            :key="'attended-' + concert.id"
            :to="`/concerts/${concert.id}`"
            class="concert-link"
        >
          {{ concert.artistName }} - {{ concert.date }}
        </router-link>

      </div>
    </div>

    <div v-else>
      <p>No hay información de usuario disponible.</p>
    </div>
  </div>
</template>

<style scoped>

.concert-link {
  display: block;
  font-size: 16px;
  margin-bottom: 12px;
  border-bottom: 1px solid #333;
  padding-bottom: 6px;
  color: white;
  text-decoration: none;
  transition: color 0.2s;
}

.concert-link:hover {
  color: #CB6CE6;
}


.profile-container {
  display: flex;
  justify-content: center;
  background-color: #000;
  color: white;
  font-family: Arial, sans-serif;
  padding: 40px;
  flex-wrap: wrap;
}

.profile-card {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 350px;
  padding: 30px;

  border-radius: 20px;

}

.profile-img {
  width: 100%;
  max-width: 200px;
  height: auto;
  border-radius: 50%;
  border: 4px solid #a855f7;
  object-fit: cover;
  margin-bottom: 20px;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}

.profile-info h1 {
  font-size: 22px;
  margin-bottom: 10px;
}

.profile-info p {
  font-size: 18px;
}

.profile-email-info {
  color: #aaa;
  font-size: 16px;
}

.profile-concert-attended,
.profile-concert-to-attended {
  background-color: #1f1f1f;
  padding: 30px;
  border-radius: 20px;
  width: 300px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
}

.profile-concert-attended h1,
.profile-concert-to-attended h1 {
  font-size: 20px;
  margin-bottom: 16px;
}

.profile-concert-attended p,
.profile-concert-to-attended p {
  font-size: 16px;
  margin-bottom: 12px;
  border-bottom: 1px solid #333;
  padding-bottom: 6px;
}

/* Responsivo para pantallas pequeñas */
@media (max-width: 768px) {
  .profile-info {
    max-width: 100%;
    padding: 20px;
  }

  .profile-img {
    max-width: 150px;
  }

  .profile-concert-attended,
  .profile-concert-to-attended {
    width: 90%;
    padding: 20px;
  }

  .profile-info h1,
  .profile-concert-attended h1,
  .profile-concert-to-attended h1 {
    font-size: 18px;
  }

  .profile-info p,
  .profile-concert-attended p,
  .profile-concert-to-attended p {
    font-size: 14px;
  }
}

.edit-button{
  background-color: #CB6BE6;
  padding: 0.6rem 1.5rem;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}
.edit-button:hover {
  background-color: #9333ea;
}

</style>