let globalDocs = null;

async function loadDocs() {
  try {
    const data = await fetch(
      "data.enc", {
      cache: "no-store"
    }
    ).then(r => r.json());
    globalDocs = data.docs;
    loadSidebar(globalDocs);
    if (globalDocs.length > 0) showDoc(globalDocs[0]);
  } catch (err) {
    console.error("Failed to load docs", err);
  }
}


function onLoginSubmit() {
    const password = document.getElementById("password-input").value;
    if (!password) {
        alert("Password required");
        return;
    }

    document.getElementById("login-backdrop").style.display = "none";

    loadDocs();
}

function loadSidebar(docs) {
    const sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = "";

    docs.forEach(doc => {
        const item = document.createElement("div");
        item.className = "item status-" + doc.status.toLowerCase();
        item.textContent = doc.title;
        item.onclick = () => showDoc(doc);
        sidebar.appendChild(item);
    });
}

function showDoc(doc) {
    const contentEl = document.getElementById("content");
    contentEl.innerHTML = doc.content;
}

document.getElementById("login-button").addEventListener("click", onLoginSubmit);
