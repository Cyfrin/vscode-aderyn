# ✨ Aderyn - Solidity Security Extension for VS Code ✨  

Aderyn helps developers detect vulnerabilities in their Solidity smart contracts using static analysis. It seamlessly integrates with Aderyn’s CLI tool, providing real-time security insights directly in VS Code.  

## 🔹 Features  

- **Real-time Security Analysis** – Detect vulnerabilities as you code.
- **Inline Diagnostics** – Highlights issues with detailed explanations.
- **Quick Fixes & Suggestions** – Offers actionable recommendations.
- **Lightweight & Fast** – Powered by Aderyn’s AST-based scanning engine.

🔗 [Aderyn CLI](https://github.com/cyfrin/aderyn)  

## 📚 Docs

- For docs, navigate to the command menu <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>P</kbd> and search for `Aderyn: Welcome`

## 🚀 Installation  

1. Download the `.vsix` file from the [Releases](https://github.com/Cyfrin/vscode-aderyn/releases) page.  
2. Open VS Code and install the extension.  

## 🛠 Contributing  

1. Clone the repository:  
   ```sh
   git clone https://github.com/cyfrin/vscode-aderyn.git
   cd vscode-aderyn
   ```  
2. Install dependencies:  
   ```sh
   make
   ```  
3. Start the development server:  
   ```sh
   make dev
   ```  
4. Install [Rust](https://www.rust-lang.org/) and clone [Aderyn](https://github.com/cyfrin/aderyn) separately.  
5. Create a [`manifest`](https://github.com/Cyfrin/vscode-aderyn/blob/main/manifest.sample) file and point it to **Cargo.toml** in Aderyn’s repository.  
6. Open the project in VS Code and press **F5** to launch a development instance.  

> Note: Step 4 and 5 are optional. Required only when debugging language server.

