<template>
  <view class="content">
    <view class="search-bar">
      <uni-search-bar
        v-model="searchKey"
        placeholder="搜索房间号"
        clearButton="auto"
        cancelButton="none"
        @confirm="handleSearch(false)"
        @clear="resetSearch"
      />
    </view>
    <view class="list" v-if="!loading">
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
            <span class="noneDay" v-if="item.noneDay"
              >退：{{ item.noneDay }}</span
            >
            <span class="noneDay" v-else></span>
            <span>
              <uni-tag text="空闲" v-if="item.houseType === 0" />
              <uni-tag text="已租" type="success" v-else />
            </span>
          </template>
        </uni-list-chat>
      </uni-list>
    </view>
    <view class="center" v-else>
      <uni-icons type="spinner-cycle" size="18"></uni-icons>
      <text>数据加载中...</text>
    </view>
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
      const res = await listHouse(query);
      this.list = res.data;
      this.loading = false;
      refresh && uni.stopPullDownRefresh();
    },
    handleSearch(refresh = false) {
      this.getHouseList(refresh, {
        houseNumber: this.searchKey,
      });
    },
    resetSearch() {
      this.searchKey = "";
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
page {
  height: 100%;
}
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.search-bar {
  flex: none;
  background-color: #f1f1f1;
}
.list {
  flex: auto;
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
