<template>
  <div v-if="message !== 'MeetMyAvatar'" class="text-center p-6">
    <h1 class="text-4xl font-bold text-blue-600">{{ message }}</h1>
  </div>
  <div v-else>
    <MeetMyAvatarHome></MeetMyAvatarHome>
  </div>
</template>

<script>
// eslint-disable-next-line
import MeetMyAvatarHome from './MeetMyAvatarHomeComponent.vue';

export default {
  name: 'HelloWorld',
  components: {
    MeetMyAvatarHome
  },
  data() {
    return {
      message: 'MeetMyAvatar'
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      this.message = 'Please wait...';
    } else {
      this.message = 'MeetMyAvatar';
    }
  }
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
