<template>
  <view class="contract-container">
    <view v-if="!loading">
      <uni-list>
        <uni-list-item title="承租人" :rightText="contractData.lessee">
        </uni-list-item>
        <uni-list-item title="手机号" :rightText="`${contractData.phone}`" />
        <!-- <uni-list-item title="身份证" :rightText="`${contractData.idCard}`" /> -->
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
        <uni-list-item
          title="常规押金"
          :note="getNormalDepositStr(contractData.depositFee)"
        ></uni-list-item>
        <uni-list-item
          title="其他押金"
          :note="getOtherDepositStr(contractData.depositFee)"
        ></uni-list-item>
        <uni-list-item
          title="加收费用"
          :note="getFeeStr(contractData.addFee)"
        ></uni-list-item>
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
import { depositEnumMap, feeEnumMap } from "@/enums/contract";

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
    // 常规押金
    getNormalDepositStr(depositFee) {
      if (depositFee && depositFee.length > 0) {
        const name = depositEnumMap[depositFee[0].depositType];
        const cost = depositFee[0].cost + "元";
        return name + cost;
      }
      return "-";
    },
    // 其他押金
    getOtherDepositStr(depositFee) {
      if (depositFee && depositFee.length > 1) {
        let result = "";
        depositFee.forEach((item) => {
          if (item.depositType === 1) {
            return;
          }
          const name = depositEnumMap[item.depositType];
          const cost = item.cost + "元";
          result += name + cost + "、";
        });
        return result;
      }
      return "-";
    },
    // 其他费用
    getFeeStr(addFee) {
      if (addFee && addFee.length > 0) {
        let result = "";
        addFee.forEach((item) => {
          const name = feeEnumMap[item.costType];
          const cost =
            item.cost +
            (item.costNum === 101 ? "元/月（随租金付）" : "元（一次付清）");
          result += name + cost + "、";
        });
        return result;
      }
      return "-";
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
