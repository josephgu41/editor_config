// Define main function (script entry)
// 需要在订阅中代理中配置：特殊落地->节点A，落地前置：选一个美国洛杉矶节点

function main(config, profileName) {
  config.proxies = config.proxies || [];
  config["proxy-groups"] = config["proxy-groups"] || [];
  config.rules = config.rules || [];

  const upstreamNames = config.proxies
    .map(p => p.name)
    .filter(n => !/剩余|到期|流量|官网|套餐|重置/.test(n));

  config.proxies.push({
    name: "节点A",
    type: "socks5",
    server: "<IP>",
    port: 45001,
    username: "<USERNAME>",
    password: "<PASSWORD>",
    udp: true,
    "dialer-proxy": "落地前置",
  });

  // 放到最前面，代理页第一眼就能看到
  config["proxy-groups"].unshift({
    name: "特殊落地",
    type: "select",
    proxies: ["节点A", "DIRECT"],
  });
  config["proxy-groups"].push({
    name: "落地前置",
    type: "select",
    proxies: upstreamNames,
  });

  config.rules.unshift(
    "DOMAIN-SUFFIX,ipinfo.io,特殊落地",
    // "PROCESS-NAME,你的进程名,特殊落地"

    // AdsPower 主程序、GPU、Renderer、Helper
    "PROCESS-PATH-WILDCARD,/Applications/AdsPower Global.app/*,特殊落地",
    // AdsPower 独立浏览器内核（常见目录）
    "PROCESS-PATH-WILDCARD,*/adspower_global/cwd_global/*,特殊落地",
    // 按进程名兜底匹配
    "PROCESS-NAME-WILDCARD,*AdsPower*,特殊落地",
    // AdsPower 浏览器进程
    "PROCESS-NAME-WILDCARD,*SunBrowser*,特殊落地",
    "PROCESS-NAME-WILDCARD,*FlowerBrowser*,特殊落地",


    // // Claude.app 目录内的所有可执行进程
    // // 覆盖主进程、Helper、GPU、Renderer、Plugin 等
    `PROCESS-PATH-WILDCARD,*/Claude.app/Contents/*,特殊落地`,
    // // Claude Desktop 主进程兜底
    `PROCESS-NAME,Claude,特殊落地`,
    // // Claude Desktop Helper 进程兜底
    `PROCESS-NAME-WILDCARD,Claude Helper*,特殊落地`,
  );

  return config;
}