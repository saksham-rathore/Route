(() => {
  const script = document.currentScript;

  const projectId = script?.dataset.pid;
  const domain = script?.dataset.domain;

  if (!projectId || !domain) {
    console.error("Beacon: project ID or domain is missing");
    return;
  }

  const data = {
    projectId,
    domain,
    url: window.location.href,
  };

  console.log("Beacon data:", data);
})();