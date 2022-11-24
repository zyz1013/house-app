const devConfig = {
  baseUrl: "https://api.baozug.cn:8080",
};

const prodConfig = {
  baseUrl: "https://api.baozug.cn:8080",
};

const config = {
  ...(process.env.NODE_ENV === "development" ? devConfig : prodConfig),
  // 应用信息
  appInfo: {
    // 应用名称
    name: "低碳水稻",
    // 应用版本
    version: "1.0.0",
    // 应用logo
    logo: "/static/logo.png",
    // 官方网站
    site_url: "",
    // 政策协议
    agreements: [
      {
        title: "隐私政策",
        url: "",
      },
      {
        title: "用户服务协议",
        url: "",
      },
    ],
  },
};

// 应用全局配置
module.exports = config;
