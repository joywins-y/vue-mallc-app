<template>
  <div class="history">
    <h4>历史记录：</h4>
    <div class="his-item" v-for="item in searchList" :key="item.item" @click="search(item.value)">
      {{ item.value }}
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {};
  },
  props: {
    searchList: {
      default() {
        return [];
      },
    },
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    search(value) {
      this.$emit('search', value);
    },
  },
};
</script>

<style scoped lang="less">
.his-item {
  padding: 15px;
  background: #eee;
  border-radius: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  display: inline-block;
}
</style>
