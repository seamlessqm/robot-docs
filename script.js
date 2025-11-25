let globalDocs = null;

    async function decryptMinimal(encObj, password) {
      const nonce = Uint8Array.from(atob(encObj.nonce), c => c.charCodeAt(0));
      const combined = Uint8Array.from(atob(encObj.data), c => c.charCodeAt(0));

      const keyBytes = await crypto.subtle.digest("SHA-256",
        new TextEncoder().encode(password)
      );

      const key = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        "AES-GCM",
        false,
        ["decrypt"]
      );

      try {
        const decrypted = await crypto.subtle.decrypt(
          {name: "AES-GCM", iv: nonce},
          key,
          combined
        );
        const decryptedText =  new TextDecoder().decode(decrypted);
          console.log(decryptedText)
          return decryptedText
      } catch (e) {
        return null;
      }
    }


async function loadDocs(password) {
  try {
    const enc = await fetch("data.enc", { cache: "no-store" }).then(r => r.json());

    const decrypted = await decryptMinimal(enc, password);

    if (!decrypted) {
      throw new Error("Wrong password");
    }

    const data = JSON.parse(decrypted);
      console.log(data)

    globalDocs = data;
      console.log(globalDocs)
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

    loadDocs(password);
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
