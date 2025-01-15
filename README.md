# PrJManager

**Streamline Your Software Development Workflow**

PrJManager is an intuitive platform designed to simplify the development ecosystem. It emulates the core functionalities of remote repository platforms while offering a personalized, streamlined experience tailored for developers who prioritize collaboration and productivity.

---

## 🌐 Live Demo  

🚀 [**Access PrJManager Here**](https://www.prjmanager.com)  

---

## 📖 Overview  

PrJManager was created with the vision of making software collaboration seamless and intuitive. Unlike other platforms, PrJManager reduces unnecessary complexity, focusing on core features that empower developers to work efficiently and collaboratively.

### Key Features  
- **Git System Emulation:**  
  - Execute commands (`push`, `pull`, `clone`, `branch`, and more) via a custom interactive console (`prjconsole`) and VSCode extension (`PrJExtension`).  
  - Secure and real-time communication powered by a socket-based backend.  

- **Project and Repository Management:**  
  - Visualize projects as hierarchical tree charts, organized by layers and repositories.  
  - Access detailed commit histories, branch management tools, and dynamic heatmap charts.  

- **Collaborator Management:**  
  - Assign roles with specific permissions for repositories and layers within a project.  

- **Activity Insights:**  
  - View global and repository-level activity metrics, including commit statistics and task progress.  

---

## 🛠️ Tech Stack  

- **Frontend:** React, TypeScript, Redux, TailwindCSS  
- **Backend:** Node.js, Express, WebSockets  
- **Additional Tools:** GitLab API, OAuth 2.0, D3.js  

---

## 📂 Project Structure  

### Client  
Frontend application built with React and Redux, providing an SPA experience with dynamic routing.  

### Server  
Backend system managing repository operations, real-time communication, and Git operations securely.  

### Extensions and Tools  
- **PrJExtension:** A VSCode extension enabling seamless interaction with PrJManager.  
- **PrJConsole:** An npm package (`npm install prjconsole`) offering an interactive CLI for executing commands.  

---

## 🚀 Getting Started  

### Prerequisites  
- Node.js (v14+ recommended)  
- npm or yarn  

### Installation  

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/yourusername/prjmanager.git
   cd prjmanager

    Install Dependencies

npm install
# or
yarn install

Run the Application

npm start

Install PrJConsole (Optional for CLI interactions)

    npm install -g prjconsole

    Configure Environment Variables
    Create a .env file with the required keys (refer to .env.example).

🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.
📝 License

This project is licensed under the MIT License. See the LICENSE file for details.
🌟 Acknowledgments

A special thanks to the open-source community and the creators of the tools and libraries that made PrJManager possible.

🔗 Visit the live application here: [PrJManager](https://www.prjmanager.com)
