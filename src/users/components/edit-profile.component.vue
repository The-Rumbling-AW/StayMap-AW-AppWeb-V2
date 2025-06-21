<script>
import CreateAndEditComponent from "@/shared/components/create-and-edit.component.vue";

export default {
  name: "edit-profile",
  components: { CreateAndEditComponent },
  props: {
    user: Object,
    visible: Boolean
  },
  emits: ['cancel-requested', 'save-requested'],
  data() {
    return {
      localUser: { ...this.user },
      submitted: false
    };
  },
  watch: {
    user(newUser) {
      this.localUser = { ...newUser };
    }
  },
  methods: {
    onCancelRequested() {
      this.$emit('cancel-requested');
    },
    onSaveRequested() {
      this.submitted = true;
      if (this.localUser.name && this.localUser.email) {
        this.$emit('save-requested', this.localUser);
      }
    }
  }
};
</script>

<template>
  <create-and-edit-component
      class="dialog-container"
      :entity="localUser"
      :visible="visible"
      :edit="true"
      entity-name="Perfil"
      size="standard"
      @cancel-action-requested="onCancelRequested"
      @save-action-requested="onSaveRequested"
  >
    <template #header>
      <h2 class="header-title">Editar perfil</h2>
    </template>

    <template #content>
      <div class="form-content">
        <div class="field">
          <pv-float-label>
            <label for="name">Nombre completo</label>
            <pv-input-text id="name" v-model="localUser.name" :class="{ 'p-invalid': submitted && !localUser.name }"/>
          </pv-float-label>
        </div>

        <div class="field">
          <pv-float-label>
            <label for="email">Correo electrónico</label>
            <pv-input-text id="email" v-model="localUser.email" :class="{ 'p-invalid': submitted && !localUser.email }"/>
          </pv-float-label>
        </div>

        <div class="field">
          <pv-float-label>
            <label for="profileImage">Foto de perfil (URL)</label>
            <pv-input-text id="profileImage" v-model="localUser.profileImage"/>
          </pv-float-label>
        </div>
      </div>
    </template>
  </create-and-edit-component>
</template>

<style scoped>
.dialog-container {
  background-color: #000000;
  padding: 2rem;
  border-radius: 20px;
  color: white;
}

.header-title {
  color: #cb6ce6;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
}

label {
  color: #cb6ce6;
  font-weight: 600;
}

input,
.p-inputtext {
  border-radius: 12px;
  padding: 10px;
  background-color: #2a2a2a;
  border: 1px solid #cb6ce6;
  color: white;
}
</style>
