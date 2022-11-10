import request from "@/utils/request";

// 查询租房合同列表
export function listContract(query) {
  return request({
    url: "/system/contract/list",
    method: "get",
    params: query,
  });
}

// 查询租房合同详细
export function getContract(id) {
  return request({
    url: "/system/contract/" + id,
    method: "get",
  });
}

// 新增租房合同
export function addContract(data) {
  return request({
    url: "/system/contract",
    method: "post",
    data: data,
  });
}

// 修改租房合同
export function updateContract(data) {
  return request({
    url: "/system/contract",
    method: "put",
    data: data,
  });
}

// 删除租房合同
export function delContract(id) {
  return request({
    url: "/system/contract/" + id,
    method: "delete",
  });
}

// 收款
export function saveContractBills(data) {
  return request({
    url: "/system/contract/saveContractBills",
    method: "post",
    data,
  });
}

// 退租
export function saveQuitHouse(data) {
  return request({
    url: "/system/contract/saveQuitHouse",
    method: "post",
    data,
  });
}
