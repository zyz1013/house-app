<template>
  <view class="contract-container">
    <div v-if="!loading">
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
    </div>
    <div class="center" v-else>
      <uni-icons type="spinner-cycle" size="30"></uni-icons>
      <span>合同加载中...</span>
    </div>
  </view>
</template>

<script>
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
      const data = await getContract(id);
      // let data = {
      //   rentTime: "2020-10-10",
      //   exitTime: "2020-11-10",
      //   rentMoney: 1000,
      //   lessee: "张三",
      //   phone: 150213111,
      //   idCard: 3308811122101112,
      //   payType: 1,
      //   betType: 1,
      // };
      this.contractData = data;
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
