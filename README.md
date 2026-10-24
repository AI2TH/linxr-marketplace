# Linxr Community Marketplace Catalog 🚀

Welcome to the **official recipe catalog** for [Linxr](https://github.com/AI2TH/Linxr) — the bare Alpine Linux VM and Docker container runner on Android by **AI2TH**.

Every recipe added to this repository becomes instantly available to Linxr users worldwide when they tap **"Sync Community"** inside the app.

---

## 🌟 How It Works

```
┌─────────────────────────────────┐
│ AI2TH/linxr-marketplace         │
│ main/recipes.json               │  <- Community Submissions & Updates
└────────────────┬────────────────┘
                 │
                 │  GET /recipes.json
                 ▼
┌─────────────────────────────────┐
│ Linxr Mobile App (Android)      │
│  • Marketplace & Recipes tab    │
│  • Auto-cached in app prefs     │
│  • One-tap container deployment │
└─────────────────────────────────┘
```

1. Anyone can submit a Pull Request adding or updating recipes in `recipes.json`.
2. Our GitHub Actions CI automatically validates the JSON syntax, schema, and port bindings.
3. Once merged to `main`, users tap the **Refresh / Sync** button in the Linxr Marketplace tab to download new recipes.
4. If a user is offline, Linxr seamlessly uses cached community recipes alongside built-in recipes.

---

## 📦 Adding a New Recipe

To contribute a new Docker container or Alpine setup script:

1. Fork this repository.
2. Edit `recipes.json` to add your entry.
3. Validate locally:
   ```bash
   node validate.js
   ```
4. Submit a Pull Request.

### Docker Recipe Example
```json
{
  "id": "caddy",
  "name": "Caddy Web Server",
  "category": "Web & Cloud",
  "type": "docker",
  "author": "Caddy Authors",
  "version": "2-alpine",
  "iconCodePoint": 58125,
  "image": "caddy:2-alpine",
  "ports": [
    { "host": 8080, "container": 80 }
  ],
  "description": "Fast, multi-platform web server with automatic HTTPS.",
  "notes": "Access Caddy at http://localhost:8080 in Chrome on your device.",
  "isCustom": false
}
```

### Script Recipe Example
```json
{
  "id": "neofetch",
  "name": "Neofetch & CLI Tools",
  "category": "Utilities",
  "type": "script",
  "author": "Community",
  "version": "latest",
  "iconCodePoint": 59048,
  "description": "Installs neofetch, htop, and tree for command-line diagnostics.",
  "script": "apk update && apk add --no-cache neofetch htop tree",
  "notes": "Run 'neofetch' in the Terminal tab to display system specs.",
  "isCustom": false
}
```

---

## 🏷️ Categories

- **Kubernetes & DevOps**: K3s, Portainer, Docker utilities, Helm.
- **Dev Environments**: VS Code Server, Node.js, Python, Rust, Go, GCC/Clang.
- **AI & ML**: Ollama, Local LLMs, PyTorch/ONNX runtime.
- **Web & Cloud**: Nginx, Caddy, Apache, static hosts.
- **Databases**: PostgreSQL, Redis, SQLite, MongoDB.
- **IoT & Network**: Mosquitto MQTT, WireGuard, tailscale.
- **Utilities**: CLI utilities, compilation tools, system monitors.

---

## 📜 License

MIT License. Copyright (c) 2026 AI2TH.
