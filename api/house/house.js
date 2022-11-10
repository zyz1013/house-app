import request from "@/utils/request";

// 查询house列表
export function listHouse(query) {
  return request({
    url: "/house/house/list",
    method: "get",
    params: query,
  });
}

// 查询house详细
export function getHouse(id) {
  return request({
    url: "/house/house/" + id,
    method: "get",
  });
}

// 新增house
export function addHouse(data) {
  return request({
    url: "/house/house",
    method: "post",
    data: data,
  });
}

// 修改house
export function updateHouse(data) {
  return request({
    url: "/house/house",
    method: "put",
    data: data,
  });
}

// 删除house
export function delHouse(id) {
  return request({
    url: "/house/house/" + id,
    method: "delete",
  });
}
