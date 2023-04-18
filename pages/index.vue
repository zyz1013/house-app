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
    <scroll-view scroll-x="true" class="filter-items">
      <view
        class="filter-tag"
        :class="{ active: filterType === -1 }"
        @click="setFilterType(-1)"
      >
        <text>全部</text>
      </view>
      <view
        class="filter-tag"
        :class="{ active: filterType === 1 }"
        @click="setFilterType(1)"
      >
        <text>空房可租</text>
      </view>
      <view
        class="filter-tag"
        :class="{ active: filterType === 2 }"
        @click="setFilterType(2)"
      >
        <text>在租中</text>
      </view>
      <view
        class="filter-tag"
        :class="{ active: filterType === 3 }"
        @click="setFilterType(3)"
      >
        <text>锁房</text>
      </view>
      <view
        class="filter-tag"
        :class="{ active: filterType === 4 }"
        @click="setFilterType(4)"
      >
        <text>合同到期</text>
      </view>
      <view
        class="filter-tag"
        :class="{ active: filterType === 5 }"
        @click="setFilterType(5)"
      >
        <text>即将到期</text>
      </view>
      <view
        class="filter-tag"
        :class="{ active: filterType === 6 }"
        @click="setFilterType(6)"
      >
        <text>欠费</text>
      </view>
      <view
        class="filter-tag"
        :class="{ active: filterType === 7 }"
        @click="setFilterType(7)"
      >
        <text>待收费</text>
      </view>
    </scroll-view>
    <view class="divider"></view>
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
          class="house"
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
    <view class="totalNum">{{ list.length }} 间</view>
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
  background-color: #fff;
}
.content {
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 20rpx;
}
.search-bar {
  flex: none;
  .uni-searchbar {
    padding: 20rpx 0 10rpx;
    .uni-searchbar__box {
      background-color: #f7f7f7 !important;
    }
  }
}

.filter-items {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: #fff;
  padding: 20rpx 0;
  white-space: nowrap;
  .filter-tag {
    min-width: 100rpx;
    padding: 8rpx 14rpx;
    color: #666;
    border-radius: 6rpx;
    background-color: #f7f7f7;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    &:not(:last-child) {
      margin-right: 20rpx;
    }
    text {
      font-size: 12px;
      font-weight: normal;
    }
    &.active {
      background-color: rgba(120, 164, 244, 0.2);
      color: #78a4f4;
    }
  }
}
.divider {
  width: 100%;
  margin-bottom: 20rpx;
  height: 1px;
  background-color: rgba(5, 5, 5, 0.06);
}
.list {
  margin: 0;
  .uni-list--border:after {
    display: none;
  }
  .uni-list--border-top {
    display: none;
  }
}
.house {
  margin-bottom: 16rpx;
  .uni-list-chat__container {
    border-radius: 30rpx;
  }
}

.empty-house {
  .uni-list-chat__container {
    background-color: #feefef;
    border-left: 3px solid #d72332;
    border-bottom: 1px solid rgba(215, 35, 50, 0.3);
  }
}
.living-house {
  .uni-list-chat__container {
    background-color: #d1f2f2;
    border-left: 3px solid #0aa;
    border-bottom: 1px solid rgba(0, 170, 170, 0.3);
  }
}

.locked-house {
  .uni-list-chat__container {
    background-color: #f2f4f7;
    border-left: 3px solid #969daa;
    border-bottom: 1px solid rgba(150, 157, 170, 0.3);
  }
}

.noneDay {
  font-size: 26rpx;
  color: #999;
}

.listItem-tag-group {
  display: flex;
  uni-tag {
    transform: scale(0.8);
    .uni-tag {
      font-size: 13px;
      padding: 4rpx 6rpx;
    }
  }
}

.totalNum {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
  background: #000;
  opacity: 0.5;
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  z-index: 9999;
}

.center {
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
