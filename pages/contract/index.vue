<template>
  <view class="contract-container">
    <view v-if="!loading">
      <uni-list>
        <uni-list-item title="承租人" :rightText="contractData.lessee">
        </uni-list-item>
        <uni-list-item title="手机号" :rightText="`${contractData.phone}`" />
        <uni-list-item title="身份证" :rightText="`${contractData.idCard}`" />
        <uni-list-item title="起租日" :rightText="contractData.rentTime" />
        <uni-list-item title="到期日" :rightText="contractData.exitTime" />
        <uni-list-item
          title="房屋租金"
          :rightText="`${contractData.rentMoney}元/月`"
        />
        <uni-list-item
          title="付款方式"
          :rightText="`付${contractData.payType}押${contractData.betType}`"
        />
      </uni-list>
    </view>
    <view class="center" v-else>
      <uni-icons type="spinner-cycle" size="30"></uni-icons>
      <text>合同加载中...</text>
    </view>
  </view>
</template>

<script>
import { getContract } from "@/api/house/contract";

export default {
  onLoad(option) {
    this.updateContract(option.contractId);
  },
  data() {
    return {
      loading: false,
      contractData: {},
    };
  },
  methods: {
    async updateContract(id) {
      this.loading = true;
      const res = await getContract(id);
      this.contractData = res.data;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #fff;
}
.center {
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
