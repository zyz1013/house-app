<template>
  <view class="content">
    <div class="search-bar">
      <uni-search-bar
        v-model="searchKey"
        placeholder="搜索房间号"
        clearButton="auto"
        cancelButton="none"
        @confirm="handleSearch()"
        @clear="resetSearch()"
      />
    </div>
    <div class="list" v-if="!loading">
      <uni-list :border="true">
        <uni-list-chat
          v-for="item in list"
          :clickable="item.houseType === 1"
          :title="item.houseNumber"
          :note="
            item.houseType === 0
              ? '暂未定价'
              : `${item.lessee}   ${item.price}元/月`
          "
          :avatar="avatar"
          @click="goToContractDetail(item.contractId)"
          badge-positon="right"
          :badge-text="item.houseType === 0 ? '空闲' : '已租'"
        >
          <template v-slot:default>
            <span class="noneDay">退：{{ item.noneDay }}</span>
            <span>
              <uni-tag text="空闲" v-if="item.houseType === 0" />
              <uni-tag text="已租" type="success" v-else />
            </span>
          </template>
        </uni-list-chat>
      </uni-list>
    </div>
    <div class="center" v-else>
      <uni-icons type="spinner-cycle" size="30"></uni-icons>
      <span>数据加载中...</span>
    </div>
  </view>
</template>

<script>
import avatarUrl from "@/static/images/man.png";
import { listHouse } from "@/api/house/house";

export default {
  onLoad: function () {
    this.handleSearch();
  },
  data() {
    return {
      avatar: avatarUrl,
      loading: false,
      list: [],
      searchKey: "",
    };
  },
  methods: {
    async getHouseList(refresh, query) {
      if (!refresh) {
        this.loading = true;
      }
      const data = await listHouse(query);
      // let data = [];
      // for (let i = 0; i < 100; i++) {
      //   data.push({
      //     houseNumber: `10` + i,
      //     houseType: i % 2 === 0 ? 0 : 1,
      //     price: 1000,
      //     lessee: "张三",
      //     noneDay: "2022-11-10",
      //     contractId: i,
      //   });
      // }
      // await new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve();
      //   }, 1000);
      // });
      this.list = data;
      this.loading = false;
      refresh && uni.stopPullDownRefresh();
    },
    handleSearch(refresh) {
      this.getHouseList(refresh, {
        houseNumber: this.searchKey,
      });
    },
    resetSearch() {
      this.getHouseList(false, {
        houseNumber: this.searchKey,
      });
    },
    goToContractDetail(contractId) {
      if (contractId) {
        uni.navigateTo({
          url: `/pages/contract/index?contractId=${contractId}`,
        });
      }
    },
  },
  onPullDownRefresh() {
    this.handleSearch(true);
  },
};
</script>

<style>
.content {
  /* height: calc(100vh - 50px - env(safe-area-inset-bottom)); */
  /* display: flex;
  flex-direction: column;
  overflow: hidden; */
  padding-top: 112rpx;
}
.search-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 112rpx;
  z-index: 99;
  background-color: #f1f1f1;
}
.list {
  overflow-y: auto;
}
.noneDay {
  font-size: 26rpx;
}
.center {
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
