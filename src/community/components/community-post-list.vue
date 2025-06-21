<script>
import CommunityPostItem from "@/community/components/community-post-item.vue";

export default {
  name: "community-post-list",
  components: {CommunityPostItem},
  props: {
    posts: {
      type: Array,
      required: true,
    }
  }
}
</script>

<template>
  <div style="border-bottom: 0.1vw solid #333840" v-for="post in posts" :key="post.id">
    <div class="community-card" >
      <community-post-item :post="post" />
    </div>
  </div>
</template>

<style scoped>
.community-card{
  padding: 1vw;
  cursor: pointer;
  width: 100%;
}

</style>