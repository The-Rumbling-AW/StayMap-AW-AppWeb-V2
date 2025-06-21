<script>
import {CommunityService} from "@/community/services/community.service.js";
import {UserService} from "@/users/services/user.service.js";
import {PostService} from "@/community/services/post.service.js";
import {Community} from "@/community/model/community.entity.js";
import {Toolbar as PvToolbar} from "primevue";
import CommunityPostList from "@/community/components/community-post-list.vue";
import {Post} from "@/community/model/post.entity.js";
import CommunityPostItem from "@/community/components/community-post-item.vue";
import {User} from "@/users/model/user.entity.js";

export default {
  name: "community-details",
  components: {CommunityPostItem, CommunityPostList, PvToolbar},
  data() {
    return {
      communityService: new CommunityService (),
      postService: new PostService(),
      userService: new UserService(),
      uploadImageService: null,
      community: new Community({}),
      posts: [],
      alreadyJoined: false,
      hoveringJoinBtn: false,
      isPostsBtnActive: true,
      newPost: null,
      isEditMode: false,
      isPostFormVisible: false
    }
  },
  created() {
    const communityId = this.$route.params.id;
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = new User({...JSON.parse(storedUser)});
    }
    this.communityService.getById(communityId).then(res => {
      this.community = new Community({...res.data});
      this.community.posts = this.community.posts.reverse();

      if (this.user && this.community.members.includes(this.user.id)) {
        this.alreadyJoined = true;
      }
      this.postService.getByCommunityId(communityId).then(res => {
        this.posts = res.data.map(item => new Post(item));
        this.posts = this.posts.reverse();
      });
    });
  },
  methods: {
    onGoBackClicked(){

    },
    onJoinClicked(){
      if (!this.alreadyJoined)
        this.joinCommunity();
      else
        this.leaveCommunity();
    },
    joinCommunity() {
      if (this.user.id !== 0 && !this.community.members.includes(this.user.id)) {
        const newCommunitiesJoined = [...this.user.communitiesJoined, this.community.id];
        const newUser = { ...this.user, communitiesJoined: newCommunitiesJoined };
        const newMembers = [...this.community.members, this.user.id];
        const newCommunity = { ...this.community, members: newMembers };
        this.communityService.update(this.community.id, newCommunity).then(res => {
          this.community = new Community({...res.data});
          this.community.posts = this.community.posts.reverse();
          this.userService.update(this.user.id, newUser).then(res => {
            this.user = new User({ ...res.data });
            localStorage.setItem("user", JSON.stringify(this.user));
            this.alreadyJoined = true;
          });
        });
      }
    },
    leaveCommunity(){
      if(this.user.id !== 0){
        //Deleting userId from members array in Community Object
        const newMembers = this.community.members.filter(userId => userId !== this.user.id);
        this.communityService.update(this.community.id, {...this.community, members: newMembers }).then(res => {
          this.community = new Community({...res.data});
          this.community.posts.reverse();
          //Deleting communityId from communitiesJoined array in User Object
          const newCommunitiesJoined = this.user.communitiesJoined.filter(communityId => communityId !== this.community.id)
          this.userService.update(this.user.id, {...this.user, communitiesJoined: newCommunitiesJoined}).then(res => {
            this.user = new User({ ...res.data });
            localStorage.setItem("user", JSON.stringify(this.user));
          });
          //Updating alreadyJoin value since User have left the Community
          this.alreadyJoined = false;
        });
      }
    }
  }
}
</script>

<template>
  <div class="community-content">
    <pv-toolbar class="community-toolbar">
      <pv-button class="go-back-btn" @click="onGoBackClicked()"><-</pv-button>
      <span class="spacer-1"></span>
      <div>
        <h2>{{community.name}}</h2>
        <span>{{community.posts.length}} posts</span>
      </div>
    </pv-toolbar>
    <div class="community-img">
      <img :src="community.image" :alt="community.name">
    </div>
    <div class="community-header">
      <div class="community-info">
        <span>{{community.name}}</span>
        <span class="spacer-2"></span>
        <pv-button>View Members</pv-button>
        <pv-button class="join-btn" @click="onJoinClicked()" @mouseenter="hoveringJoinBtn = true" @mouseleave="hoveringJoinBtn = false">
          {{alreadyJoined ? (hoveringJoinBtn ? "Leave" : "Joined") : "Join"}}
        </pv-button>
      </div>
      <div class="community-description">
        {{community.description}}
      </div>
    </div>
    <div style="display: flex; border-bottom: 0.1vw solid #333840">
      <div :class="['posts-btn', { active: isPostsBtnActive }]">
        <div>
          <div>Posts</div>
          <div class="underline" v-if="isPostsBtnActive"></div>
        </div>
      </div>
    </div>
    <div class="community-posts">
      <pv-button class="post-btn" v-if="alreadyJoined" @click="isPostFormVisible = true">Add a new post</pv-button>
      <div v-for="post in posts" style="  padding: 1vw; cursor: pointer; width: 100%;">
        <community-post-item :post="post" />
      </div>
    </div>
  </div>
</template>

<style>

.community-toolbar{
  color:#fff;
  h2{
    margin: 0;
    font-size: 20px;
  }
  span{
    font-size: 14px;
  }
}

.go-back-btn{
  border-radius: 100vw;
  font-size: 20px;
  font-weight: bold;
  padding: 0.5vw;
  min-width: unset;
}

.go-back-btn:hover {
  background-color: #333840;
}

.spacer-1{
  margin: 0.1vw;
}

.spacer-2{
  flex: 1 auto;
}

.community-content{
  overflow: hidden;
  border-radius: 1vw;
  background-color: #121212;
  color: white;
  margin: 0 auto;
  display: block;
  justify-content: center;
  width: 35vw;
  height: 90vh;
  overflow-y: scroll;
}

.community-img{
  margin: 0 auto;
  display: flex;
  justify-content: center;
  height: 20vw;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.community-info{
  display: flex;
  align-items: center;
  margin: 1vw;
  button{
    background-color: #CB6CE6;
    color: white;
    font-weight: bold;
    border-radius: 4rem;
    margin-left: 0.5vw;
  }

  button:hover{
    background-color: #CB6CE6;
    color: white;
    font-weight: bold;
    border-radius: 4rem;
    margin-left: 0.5vw;
  }


  span{
    font-size: 20px;
    font-weight: bold;
  }
}

.community-description{
  margin: 1vw;
}

.posts-btn{
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  align-items: center;
  padding: 1rem;
}

.posts-btn:hover{
  background: #080808;
}

.posts-btn.active{
  font-weight: bold;
  color: #CB6CE6;
}

.underline {
  margin-top: 4px;
  width: 100%;
  height: 4px;
  background-color:  #CB6CE6;
  border-radius: 2px;
}

.post-btn{
  margin: 1vw;
  background: #CB6CE6;
  border-radius: 12px;
  font-weight: bold;
}

</style>
