export const contractTypeEnumMap = {
  0: "已退租",
  1: "在租中",
};

export function getContractType(type) {
  return contractTypeEnumMap[type];
}

export const feeEnumMap = {
  1: "电费",
  2: "冷水费",
  3: "网费",
  4: "物业费",
  5: "维修费",
  6: "保洁费",
  7: "短租费",
};

export const depositEnumMap = {
  1: "常规押金",
  2: "水费押金",
  3: "设备押金",
};
