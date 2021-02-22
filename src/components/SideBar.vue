<template>
  <div class="sidebar-wrapper" ref="side">
    <div
      v-for="(item, i) in sideList"
      :key="item"
      :class="{ active: index === i }"
      @touchend="scrollTo(i, $event)"
      @touchstart="move = false"
      @touchmove="move = true"
    >
      {{ i === 0 ? "全部" : item }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import tools from '../util/tools';

export default {
  name: '',
  data() {
    return {
      index: 0,
      move: false,
    };
  },
  props: {},
  components: {},
  computed: {
    ...mapState({
      sideList: (state) => state.sideList,
    }),
  },
  watch: {},
  created() {},
  mounted() {
    // 获取列表页数据操作
    // this.resetGoodsList();
    // this.getGoodsList({ type: this.sideList[0], page: 1, sortType: 'all' });
  },
  methods: {
    ...mapMutations(['resetGoodsList']),
    ...mapActions(['getGoodsList']),
    scrollTo(i, e) {
      if (this.move) {
        return;
      }
      this.index = i;
      // 获取需要移动的距离
      // 父元素
      const { side } = this.$refs;
      // 子元素到顶部的距离top 以及 子元素的高度 getBoundingClientRect() 获取某个元素相对于视窗的位置集合
      const sonTop = e.target.getBoundingClientRect().top;
      const sonHeight = e.target.offsetHeight;
      // 父元素的top
      const pTop = side.getBoundingClientRect().top;
      const pHeight = side.offsetHeight;

      // side.scrollTop += sonTop + sonHeight / 2 - pTop - pHeight / 2;
      tools.moveTo(side.scrollTop, sonTop + sonHeight / 2 - pTop - pHeight / 2, side, 'scrollTop');

      // 获取列表页数据操作
      this.resetGoodsList();
      this.getGoodsList({ type: this.sideList[i], page: 1, sortType: 'all' });
    },
  },
};
</script>

<style scoped lang="less">
.sidebar-wrapper {
  position: fixed;
  left: 0;
  width: 79px;
  top: 135px;
  bottom: 50px;
  overflow: auto;
  background: #fff;

  div {
    width: 79px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    position: relative;
  }

  .active {
    font-weight: bold;
    color: #ff1a90;
  }

  .active::before {
    content: "";
    position: absolute;
    width: 6px;
    height: 18px;
    background-color: #ff1a90;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }
}

.sidebar-wrapper::-webkit-scrollbar {
  width: 0;
  background: none;
}
</style>
