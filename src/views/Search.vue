<template>
  <div class="search-wrapper">
    <div class="search-header">
      <van-icon name="arrow-left" class="arr-left" @click="$router.goBack()" />
      <van-search
        v-model="value"
        class="search-content"
        show-action
        :placeholder="place"
        @search="onSearch"
        @input="input"
        @focus="focus"
        autofocus
      >
        <template #action v-if="showList">
          <div @click="onSearch(value)">搜索</div>
        </template>
        <template #action v-else>
          <van-icon
            name="cart-o"
            id="shop-car"
            class="shop-car"
            :badge="badge"
            @click="$router.push('/home/shopping')"
          />
        </template>
      </van-search>
    </div>
    <div class="like-search" v-if="likeList.length && showList">
      <van-list>
        <van-cell v-for="item in likeList" :key="item" @click="onSearch(item)">
          <template>
            <span class="custom-title" v-html="formatHTML(item)"></span>
          </template>
        </van-cell>
      </van-list>
    </div>
    <div class="goods-list" v-if="!showList">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <goods-card
          v-for="item in goodsList"
          :key="item.id"
          v-bind="item"
          :num="counterMap[item.id]"
        >
        </goods-card>
      </van-list>
    </div>
    <div class="my-history">
      <my-history
        v-if="likeList.length <= 0 && showList"
        :searchList="searchList"
        @search="onSearch"
      >
      </my-history>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import goodsCard from '../components/GoodsCard.vue';
import myHistory from '../components/MyHistory.vue';

export default {
  name: '',
  data() {
    return {
      place: '酒',
      value: this.place,
      // 搜索返回的数组数据
      likeList: [],
      timer: null,
      loading: false,
      finished: false,
      page: 1,
      size: 5,
      goodsList: [],
      // 控制搜索结果的显示
      showList: true,
      total: 0,
      searchList: [],
    };
  },
  props: {},
  components: {
    goodsCard,
    myHistory,
  },
  computed: {
    ...mapState({
      counterMap: (state) => state.counterMap,
    }),
    badge() {
      const count = Object.values(this.counterMap).reduce((prev, next) => prev + next, 0);
      if (count > 99) {
        return '99+';
      }
      return count;
    },
  },
  watch: {},
  created() {
    this.searchList = JSON.parse(localStorage.getItem('searchList')) || [];
  },
  mounted() {},
  methods: {
    // 加载
    async onLoad() {
      this.showList = false;
      const value = await this.$api.search(this.value, this.page, this.size);
      this.goodsList = [...this.goodsList, ...value.list];
      this.total = value.total;
      this.loading = false;
      if (this.goodsList.length >= this.total) {
        this.finished = true;
      } else {
        this.page += 1;
      }
    },
    // 搜索
    async onSearch(value) {
      if (value) {
        this.value = value;
      } else {
        this.value = this.place;
      }
      // 存数据 searchList 先看是否已存在
      const result = this.searchList.find((item) => item.value === this.value);
      if (result) {
        result.time = new Date().getTime();
        this.searchList.sort((a, b) => b.time - a.time);
      } else {
        this.searchList.unshift({
          value: this.value,
          time: new Date().getTime(),
        });
        if (this.searchList.length >= 11) {
          this.searchList.pop();
        }
      }
      localStorage.setItem('searchList', JSON.stringify(this.searchList));
      // 初始化
      this.likeList = [];
      this.goodsList = [];
      this.page = 1;
      this.finished = false;
      this.onLoad();
      this.showList = false;
    },
    // 防抖
    async input() {
      if (this.value === '') {
        this.likeList = [];
        return;
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      } else {
        this.timer = setTimeout(async () => {
          const value = await this.$api.likeSearch(this.value);
          this.likeList = value.result;
          clearTimeout(this.timer);
          this.timer = null;
        }, 300);
      }
    },
    // 聚焦搜索框显示列表
    focus() {
      this.showList = true;
    },
    // 匹配到的关键字颜色会改变
    formatHTML(item) {
      const reg = new RegExp(this.value, 'g');
      return item.replace(reg, this.value.fontcolor('red'));
    },
  },
};
</script>

<style scoped lang="less">
.search-wrapper {
  width: 100%;
  height: 100vh;
  z-index: 10;
  background-color: #fff;

  .search-header {
    width: 345px;
    background-color: #fff;
    margin: 0 auto;
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 15px;
    z-index: 100;

    .arr-left {
      font-size: 22px;
    }

    .search-content {
      flex: 1;

      .shop-car {
        font-size: 22px;
      }
    }
    .van-search__action {
      line-height: 0;
    }
  }

  .like-search {
    position: relative;
    top: 50px;
    width: 100%;
    box-sizing: border-box;
    padding-left: 30px;
    background: #fff;
    z-index: 10;
  }

  .goods-list {
    position: relative;
    width: 345px;
    margin: 48px auto 0;
    z-index: 10;
    background-color: #fff;
  }

  .my-history {
    width: 350px;
    position: absolute;
    top: 35px;
    left: 10px;
    z-index: 1;
  }
}
</style>
