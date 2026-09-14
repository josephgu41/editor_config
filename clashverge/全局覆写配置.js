// Define main function (script entry)

function main(config, profileName) {
  // Force UDP to be enabled for all proxy nodes
  if (config.proxies) {
    for (let i = 0; i < config.proxies.length; i++) {
      config.proxies[i].udp = true;
    }
  }

  // Enable UDP forwarding globally (mandatory)
  config.udp = true;

  return config;
}