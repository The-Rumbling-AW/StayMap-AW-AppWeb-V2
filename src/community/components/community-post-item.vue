<script>
import {User} from "@/users/model/user.entity.js";
import {Post} from "@/community/model/post.entity.js";
import {UserService} from "@/users/services/user.service.js";

export default {
  name: "community-post-item",
  props: {
    post: {
      type: Post,
      required: true,
    }
  },
  components: {},
  data() {
    return {
      user: new User({}),
      userService: new UserService()
    }
  },
  created() {
    this.userService.getById(this.post.userId).then(response => {
      this.user = response.data;
    });
  },
  methods: {
    getPostedAtText() {
      const date = new Date(this.post.postedAt);
      const now = new Date();
      const diffInMs = now - date;
      const seconds = Math.floor(diffInMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (seconds < 60) {
        return `${seconds}s`;
      } else if (minutes < 60) {
        return `${minutes}min`;
      } else if (hours < 24) {
        return `${hours}h`;
      } else {
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('es-ES', options) + '.';
      }
    }
  }
}
</script>

<template>
  <div class="mat-card">
    <div style="font-size: 15px;">
      <div style="display: flex; gap: 0.5vw">
        <img class="mat-card-avatar" :src="user.profileImage" :alt="user.name" style="max-width: 50px;height: 50px; border-radius: 100px">
        <div style="width: 100%; padding-bottom: 2px;">
          <div style="display: grid;">
            <div style="display: flex; align-items: center; margin-bottom: 10px">
              <div style="font-weight: bold;">
                {{ user.name }}
                <span style="font-weight: normal; color: #70757a"> · {{ getPostedAtText() }}</span>
                <br>
                <div style="font-weight: normal; margin-top: 5px">
                  {{ post.content }}
                </div>
              </div>
              <span style="flex: 1 auto;"></span>
              <span class="options-btn">
                ...
              </span>
            </div>
          </div>
          <div v-if="post.imageUrl !== ''" style="max-width: 100%; height: 35dvh;">
            <img :src="post.imageUrl" :alt="post.id" style="height: 100%; max-width: 100%; object-fit: cover; border: 1px solid #70757a; border-radius: 12px">
          </div>
        </div>
      </div>
    </div>
  </div>
  <router-view />
</template>

<style scoped>
.options-btn{
  border-radius: 100vw;
  padding: 10px;
  font-weight: bold;
  min-width: unset;
  color: #70757a;
  margin: 0;
}

.options-btn:hover {
  background-color: #333840;
}
</style>