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
    <scroll-view scroll-x="true" class="tags-group">
      <view style="padding: 10px">
        <uni-tag
          class="tag-filter"
          :type="filterType === -1 ? 'success' : 'default'"
          text="全部"
          @click="setFilterType(-1)"
        />
        <uni-tag
          class="tag-filter"
          :type="filterType === 1 ? 'success' : 'default'"
          text="空房可租"
          @click="setFilterType(1)"
        />
        <uni-tag
          class="tag-filter"
          :type="filterType === 2 ? 'success' : 'default'"
          text="在租中"
          @click="setFilterType(2)"
        />
        <uni-tag
          class="tag-filter"
          :type="filterType === 3 ? 'success' : 'default'"
          text="锁房"
          @click="setFilterType(3)"
        />
        <uni-tag
          class="tag-filter"
          :type="filterType === 4 ? 'success' : 'default'"
          text="合同到期"
          @click="setFilterType(4)"
        />
        <uni-tag
          class="tag-filter"
          :type="filterType === 5 ? 'success' : 'default'"
          text="即将到期"
          @click="setFilterType(5)"
        />
        <uni-tag
          class="tag-filter"
          :type="filterType === 6 ? 'success' : 'default'"
          text="欠费"
          @click="setFilterType(6)"
        />
        <uni-tag
          class="tag-filter"
          :type="filterType === 7 ? 'success' : 'default'"
          text="待收费"
          @click="setFilterType(7)"
        />
      </view>
    </scroll-view>

    <view class="list" v-if="!loading && list.length > 0">
      <uni-list :border="true">
        <uni-list-chat
          :class="
            item.houseType === 0
              ? 'empty-house'
              : item.houseType === 1
              ? 'living-house'
              : 'locked-house'
          "
          v-for="item in list"
          :key="item.id"
          :clickable="item.houseType === 1"
          :title="item.houseNumber"
          :note="
            item.houseType === 1
              ? `${item.lessee}   ${item.price}元/月`
              : '暂未定价'
          "
          :avatar="avatar"
          @click="goToContractDetail(item.contractId)"
          badge-positon="right"
          :badge-text="item.houseType === 0 ? '空闲' : '已租'"
        >
          <template v-slot:default>
            <uni-icons
              type="locked-filled"
              size="28"
              v-if="item.houseType === 2"
            ></uni-icons>
            <view class="noneDay" v-if="item.noneDay"
              >退：{{ item.noneDay }}</view
            >
            <view class="noneDay" v-if="!item.noneDay"></view>
            <view class="listItem-tag-group">
              <uni-tag
                text="离"
                type="primary"
                v-if="item.houseChaox === 2"
              ></uni-tag>
              <uni-tag
                text="结"
                type="error"
                v-if="item.houseChaox === 1"
              ></uni-tag>
              <uni-tag
                text="欠"
                type="error"
                v-if="item.arrears === 1"
              ></uni-tag>
              <uni-tag
                text="收"
                type="warning"
                v-if="item.waitArrears === 1"
              ></uni-tag>
            </view>
          </template>
        </uni-list-chat>
      </uni-list>
    </view>
    <view class="center" v-if="loading">
      <uni-icons type="spinner-cycle" size="18"></uni-icons>
      <text>数据加载中...</text>
    </view>
    <view class="center" v-if="list.length === 0 && !loading">
      <text>没有更多房源了</text>
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
      filterType: -1,
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
      const houseType =
        this.filterType === 1
          ? 0
          : this.filterType === 2
          ? 1
          : this.filterType === 3
          ? 2
          : undefined;
      const houseChaox =
        this.filterType === 4 ? 1 : this.filterType === 5 ? 2 : undefined;
      const arrears = this.filterType === 6 ? 1 : undefined;
      const waitArrears = this.filterType === 7 ? 1 : undefined;
      const params = {
        houseNumber: this.searchKey,
        houseType,
        houseChaox,
        arrears,
        waitArrears,
      };
      this.getHouseList(refresh, {
        ...params,
      });
    },
    resetSearch() {
      this.searchKey = "";
      this.handleSearch(false);
    },
    setFilterType(type) {
      this.filterType = type;
      this.handleSearch(false);
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

<style lang="scss">
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
  .uni-searchbar {
    padding: 20rpx 20rpx 10rpx;
  }
}

.tags-group {
  white-space: nowrap;
}
.tag-filter:not(:last-child) {
  margin-right: 10rpx;
  .uni-tag {
    padding: 12rpx 14rpx;
  }
}

.list {
  flex: auto;
  overflow-y: auto;
}
.empty-house {
  margin-bottom: 6rpx;
  .uni-list-chat__container {
    background-color: #feefef;
    border-left: 3px solid #d72332;
  }
}
.living-house {
  margin-bottom: 6rpx;
  .uni-list-chat__container {
    background-color: #d1f2f2;
    border-left: 3px solid #0aa;
  }
}

.locked-house {
  margin-bottom: 6rpx;
  .uni-list-chat__container {
    background-color: #f2f4f7;
    border-left: 3px solid #969daa;
  }
}

.noneDay {
  font-size: 26rpx;
}
.listItem-tag-group {
  display: flex;
  gap: 8rpx;
}

.center {
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
