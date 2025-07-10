

<img width="2559" height="1394" alt="Screenshot 2025-07-10 205203" src="https://github.com/user-attachments/assets/150363b0-a16e-4ff7-b210-34106e387c0b" />

# PrJManager 🟩

**PrJManager** is a full-featured, GitHub-style project management platform built from scratch. It provides a centralized, modular system for managing repositories, collaborators, and development workflows in real-time.

## 🚀 Features

- 🧱 **Modular Layered Architecture** – Organize code in scalable layers and repositories.
- 🧑‍💻 **Collaborator Management** – Invite users and assign project roles.
- 🕒 **Real-Time Updates** – WebSocket-powered communication for instant collaboration.
- 📦 **Custom Repository System** – Internal logic for storing and versioning code artifacts.
- 🔐 **Secure Authentication** – (Extendable for OAuth2 or token-based systems).
- ⚙️ **Built to integrate with [PrJExtension](https://github.com/nemrodc/PrJExtension)** – A custom VSCode extension for remote interaction.

## 🛠 Tech Stack

- **Frontend:** React, TypeScript
- **Backend:** Node.js, Express
- **Real-time Communication:** WebSockets
- **Database:** (PostgreSQL or other supported DB engines)
- **Other:** Git logic (custom), REST API design, JWT/OAuth2-ready architecture


🔌 VSCode Integration (Optional)

This project is designed to work alongside [PrJExtension](https://marketplace.visualstudio.com/items?itemName=cclmal.prjextension)
 – a custom VSCode extension for interacting with PrJManager directly from the editor.

 ## 🔌 VSCode Integration 

This project is designed to work alongside:

- **[PrJExtension](https://marketplace.visualstudio.com/items?itemName=cclmal.prjextension)** – A custom Visual Studio Code extension that allows remote interaction with PrJManager directly from the editor.
- **[PrJConsole](https://www.npmjs.com/package/prjconsole)** – An interactive in-editor console that communicates with PrJExtension, allowing the execution of real-time commands and enhancing the development workflow from within VSCode.

These tools together create a seamless development experience, connecting the code editor with the backend project management platform in real time.

 

🤝 Contributing

Feel free to fork this repo, suggest improvements or submit pull requests. Feedback is always welcome!
📄 License

MIT License
