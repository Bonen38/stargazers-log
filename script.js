async function loadStarredRepositories() {
  const list = document.querySelector("#starred");
  const status = document.querySelector("#starred-status");

  if (!list || !status) {
    return;
  }

  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Could not load starred repositories (${response.status})`);
    }

    const events = await response.json();

    if (!Array.isArray(events)) {
      throw new Error("Starred repository data has an unexpected format");
    }

    list.replaceChildren();
    list.setAttribute("aria-busy", "false");

    if (events.length === 0) {
      status.textContent = "No starred repositories found.";
      return;
    }

    for (const event of events) {
      if (
        typeof event.name !== "string" ||
        typeof event.starred !== "string"
      ) {
        throw new Error("A starred repository entry is incomplete");
      }

      const item = document.createElement("li");
      item.textContent = `${event.name} — starred ${event.starred}`;
      list.appendChild(item);
    }

    status.textContent = "";
  } catch (error) {
    console.error(error);

    list.replaceChildren();
    list.setAttribute("aria-busy", "false");
    status.textContent =
      "Sorry, starred repositories could not be loaded. Please try again later.";
  }
}

loadStarredRepositories();