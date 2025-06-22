<script>
import CreateAndEditComponent from "@/shared/components/create-and-edit.component.vue";

export default {
  name: "concert-item-create-and-edit-dialog",
  components: {CreateAndEditComponent},
  props: {
    item: null,
    visible: false,
    edit: false,
  },
  emits: ['cancel-requested', 'save-requested'],
  data() {
    return {
      submitted: false
    }
  },
  methods: {
    onCancelRequested() {
      this.$emit('cancel-requested');
    },
    onSaveRequested() {
      this.submitted = true;

      // Formatear la fecha
      if (this.item.date instanceof Date) {
        const opciones = { day: '2-digit', month: 'long' };
        const fechaFormateada = this.item.date.toLocaleDateString('es-ES', opciones);
        this.item.date = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
      }

      // Si no tiene ID, generarlo automáticamente como string (consecutivo)
      if (!this.item.id) {
        const existingConcerts = JSON.parse(localStorage.getItem('concerts') || '[]');
        const lastId = existingConcerts.reduce((max, c) => Math.max(max, Number(c.id)), 0);
        this.item.id = String(lastId + 1);
      }

      this.$emit('save-requested', this.item);
    }
  }
}
</script>
<template>
  <create-and-edit-component
      class="dialog-container"
      :entity="item"
      :visible="visible"
      :edit="edit"
      entity-name="Concierto"
      size="standard"
      @cancel-action-requested="onCancelRequested"
      @save-action-requested="onSaveRequested"
  >
    <template #header>
      <h2 class="header-title">Nuevo concierto</h2>
    </template>

    <template #content>
      <div class="form-content">
        <!-- Artist Name -->
        <div class="field mt-5">
          <pv-float-label>
            <label for="artistName">Artist Name</label>
            <pv-input-text
                id="artistName"
                v-model="item.artistName"
                :class="{ 'p-invalid': submitted && !item.artistName }"
            />
          </pv-float-label>
        </div>

        <!-- Artist Genre -->
        <div class="field mt-3">
          <pv-float-label>
            <label for="genre">Artist Genre*</label>
            <pv-dropdown
                id="genre"
                :options="['Pop', 'Rock', 'K-pop', 'Indie', 'Urbano', 'Electrónica', 'Salsa', 'Cumbia', 'Jazz']"
                v-model="item.genre"
                placeholder="Select a genre"
                :class="{ 'p-invalid': submitted && !item.genre }"
            />
          </pv-float-label>
        </div>

        <!-- Image URL -->
        <div class="field mt-3">
          <pv-float-label>
            <label for="image">Image URL</label>
            <pv-input-text id="image" v-model="item.image" />
          </pv-float-label>
        </div>

        <!-- Description -->
        <div class="field mt-3">
          <pv-float-label>
            <label for="description">Description</label>
            <pv-input-text id="description" v-model="item.description" />
          </pv-float-label>
        </div>

        <!-- Date -->
        <div class="field mt-3">
          <pv-float-label>
            <label for="date">Date*</label>
            <pv-calendar id="date" v-model="item.date" show-icon />
          </pv-float-label>
        </div>

        <!-- Venue Name -->
        <div class="field mt-3">
          <pv-float-label>
            <label for="venueName">Venue's name</label>
            <pv-input-text id="venueName" v-model="item.venueName" />
          </pv-float-label>
        </div>

        <!-- Venue Address -->
        <div class="field mt-3">
          <pv-float-label>
            <label for="venueAddress">Venue's address</label>
            <pv-input-text id="venueAddress" v-model="item.venueAddress" />
          </pv-float-label>
        </div>
      </div>
    </template>
  </create-and-edit-component>
</template>

<style >
.dialog-container {
  background-color: #000000;
  padding: 2rem;
  border-radius: 20px;
  color: white;
  max-height: 90vh;
  overflow-y: auto;
}

/* Título */
.header-title {
  color: #cb6ce6;
  text-align: center;
  width: 100%;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto;
}

/* Contenido del formulario */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 1rem;
}

/* Campo */
.field {
  display: flex;
  flex-direction: column;
}

/* Etiquetas */
label {
  color: #cb6ce6;
  font-weight: 600;
  margin-bottom: 5px;
}

/* Inputs, Dropdowns, Calendars */
input,
.p-inputtext,
.p-dropdown,
.p-calendar,
.p-dropdown-label {
  border-radius: 12px;
  padding: 10px;
  background-color: #2a2a2a !important;
  border: 1px solid #cb6ce6;
  color: white;
}

/* Placeholder */
input::placeholder,
.p-inputtext::placeholder,
.p-dropdown-label.p-placeholder {
  color: #bbb;
}

/* Focus */
input:focus,
.p-inputtext:focus,
.p-dropdown:focus,
.p-calendar:focus,
.p-focus {
  border-color: #cb6ce6 !important;
  box-shadow: 0 0 5px #cb6ce6;
}

/* Botones del diálogo */
.p-dialog-footer .p-button {
  border-radius: 12px;
  font-weight: bold;
}

/* Scrollbar estilizado */
.dialog-container::-webkit-scrollbar {
  width: 8px;
}
.dialog-container::-webkit-scrollbar-thumb {
  background-color: #cb6ce6;
  border-radius: 10px;
}
.dialog-container::-webkit-scrollbar-track {
  background-color: #1a1a1a;
}

:deep(.p-dialog),
:deep(.p-dialog-content),
:deep(.p-dialog-header),
:deep(.p-dialog-footer) {
  background-color: #000000 !important;
  color: white !important;
  border-radius: 20px;
}

/* Ajustes de inputs, dropdowns, calendar */
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-calendar),
:deep(.p-dropdown-label) {
  background-color: #2a2a2a !important;
  color: white !important;
  border: 1px solid #cb6ce6 !important;
  border-radius: 12px;
}

/* Placeholders */
:deep(.p-dropdown-label.p-placeholder),
:deep(input::placeholder) {
  color: #bbb !important;
}
</style>
