<template>
  <div class="">
    <router-view></router-view>
    <tab-bar></tab-bar>
  </div>
</template>

<script>
import tabBar from '../components/TabBar.vue';

export default {
  name: '',
  data() {
    return {};
  },
  props: {},
  components: {
    tabBar,
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less"></style>
