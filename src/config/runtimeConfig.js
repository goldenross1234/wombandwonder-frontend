let config = null;

export async function loadConfig() {
  if (!config) {
    const response = await fetch('/config.json');
    config = await response.json();
  }
  return config;
}
