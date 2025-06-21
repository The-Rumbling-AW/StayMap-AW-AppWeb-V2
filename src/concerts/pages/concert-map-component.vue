<script>
import { Loader } from '@googlemaps/js-api-loader';
import { ConcertService } from '@/concerts/services/concert.services';
import { Concert } from '@/concerts/model/concert.entity';

export default {
  name: "concert-map-component",
  data() {
    return {
      concerts: [],
      map: null,
      infoWindow: null,
      markers: [],
      userLocation: {
        lat: -12.076837528231636,
        lng: -77.09347965592731,
        icon: 'https://the-rumbling.github.io/StayMap-Landing_Page/starymaplogo.png'
      },
      concertService: null,
    };
  },
  methods: {
    loadMap() {
      const loader = new Loader({
        apiKey: 'AIzaSyAd-IuCKmGRzA4BsS2Yz_hR5FD6-XHUqjA',
        version: 'weekly',
      });

      loader.load().then(() => {
        this.map = new google.maps.Map(this.$refs.map, {
          center: this.userLocation,
          zoom: 13,
          disableDefaultUI: true,
        });

        new google.maps.Marker({
          position: this.userLocation,
          map: this.map,
          icon: {
            url: this.userLocation.icon,
            scaledSize: new google.maps.Size(40, 40)
          }
        });

        this.infoWindow = new google.maps.InfoWindow();

        this.concerts.forEach(concert => {
          const position = {
            lat: Number(concert.venueLat) + this.getRandomOffset(),
            lng: Number(concert.venueLng) + this.getRandomOffset()
          };

          const marker = new google.maps.Marker({
            position,
            map: this.map,
            icon: {
              url: 'https://the-rumbling.github.io/StayMap-Landing_Page/starymaplogo.png',
              scaledSize: new google.maps.Size(40, 40)
            }
          });




          marker.addListener('click', () => {
            const data = JSON.parse(JSON.stringify(concert));
            this.infoWindow.setContent(
                `<div style="font-family: Arial, sans-serif; color: black; padding: 4px;">
                  <h3 style="margin: 0; font-size: 16px;">${data.artistName}</h3>
                 <p style="margin: 0; font-size: 14px;">${data.venueName} - ${data.date}</p>
                </div>`
            );
            this.infoWindow.open(this.map, marker);
          });

          this.markers.push(marker);
        });
      });


    },
    getRandomOffset() {
      const offset = 0.00005;
      return (Math.random() - 0.5) * offset;
    },
    fetchConcerts() {
      this.concertService = new ConcertService();
      this.concertService.getAll().then(response => {
        console.log('API response:', response.data);
        this.concerts = response.data.map(c => new Concert(c));
        this.loadMap();
      });
    },

    goToDetails(concertId) {
      this.$router.push(`/concerts/${concertId}`);
    },


    zoomToVenue(concert) {
      const lat = Number(concert.venueLat);
      const lng = Number(concert.venueLng);

      if (this.map && lat && lng) {
        this.map.setZoom(17); // puedes ajustar el zoom
        this.map.panTo({ lat, lng });
      }
    }


  },
  mounted() {
    this.fetchConcerts();
  }

};
</script>

<template>
  <div class="container">
    <div class="sidebar">
      <div v-for="concert in concerts" :key="concert.id" class="card">
        <h3 @click="goToDetails(concert.id)" style="cursor: pointer; color: #b54cf4;">
          {{ concert.artistName }}
        </h3>

        <p @click="zoomToVenue(concert)" style="cursor: pointer; text-decoration: underline;">
          {{ concert.venueName }} - {{ concert.date }}
        </p>

        <span :class="['status-badge', concert.status === 'Available' ? 'available' : 'soldout']">
          {{ concert.status }}
        </span>
      </div>
    </div>
    <div class="map-section">
      <h1>Encuentra conciertos <span class="resaltado">cercanos</span></h1>
      <div ref="map" class="mapa-style"></div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: #121212;
  color: white;
  font-family: system-ui, Arial, sans-serif;
  text-decoration: none; /* Global fallback */
}

/* SIDEBAR */
.sidebar {
  width: 300px;
  background-color: #1e1e1e;
  padding: 1rem;
  overflow-y: auto;
  border-right: 1px solid #2b2b2b;
}

/* Card */
.card {
  background: #2a2a2a;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Hover efecto visual */
.card:hover {
  transform: scale(1.01);
  box-shadow: 0 0 14px rgba(181, 76, 244, 0.4);
}

.card h3,
.card p {
  margin: 0;
  cursor: pointer;
  text-decoration: none;
  color: white;
}

.card h3 {
  color: #cb6ce6;
  font-weight: bold;
  font-size: 1rem;
  text-decoration: none;
}

.card h3:hover,
.card p:hover {
  color: #e5c1ff;
}

.card a {
  color: inherit;
  text-decoration: none;
}

/* Badges */
.status-badge {
  display: inline-block;
  margin-top: 0.7rem;
  padding: 0.25rem 0.7rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: bold;
  text-align: center;
}

.available {
  background-color: #2ecc71;
  color: white;
}

.soldout {
  background-color: #e74c3c;
  color: white;
}

.map-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.map-section h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
}

.mapa-style {
  flex: 1;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.1);
}

.resaltado {
  color: #cb6ce6;
  font-weight: bold;
}
</style>

