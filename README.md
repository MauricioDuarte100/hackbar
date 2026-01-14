# HackBar Pro

The ultimate browser extension for **Penetration Testing**, **CTF**, and **Bug Bounty Hunting**.

HackBar Pro is an enhanced version of the classic HackBar, redesigned to meet the needs of modern security professionals. It offers a comprehensive suite of tools for payload generation, encoding/decoding, and automated testing, all integrated directly into your browser's Developer Tools.

## Key Features

### Smart & Automated
*   **Smart Inject Auto-Fuzzer**: Automatically injects payloads into *every* URL parameter and POST body field with a single click. Ideal for quickly checking multiple input vectors.
*   **One-Click Reverse Shells**: Generate ready-to-use reverse shell commands for Python, Bash, Perl, PHP, PowerShell, and Netcat.
*   **Auto-Execute**: Shortcuts (`Ctrl + Enter`) and smart interactions designed for speed.

### Comprehensive Payload Library
HackBar Pro comes packed with categorized payloads for major vulnerabilities:

*   **SQL Injection (SQLi)**: Union-based, Error-based, Boolean-blind, Time-blind. Supported DBs: MySQL, PostgreSQL, SQLite, MSSQL.
*   **XSS (Cross-Site Scripting)**: Polyglots, Event Handlers, Vue/Angular specific vectors.
*   **Command Injection (CMDi)**: Unix/Windows probes, Filter bypass techniques (`${IFS}`, wildcards), OOB exfiltration.
*   **XXE (XML External Entity)**: Local file reading, Blind OOB, SOAP wrapping.
*   **SSTI (Server-Side Template Injection)**: Jinja2, Java, Ruby (ERB), Node.js (Pug, Handlebars), Smarty.
*   **LFI (Local File Inclusion)**: Wrapper techniques (`php://filter`), path traversal.
*   **Open Redirect**: Common bypass patterns (`//`, `/\`, `%00`).

### Utility Belt
*   **Encoding/Decoding**: URL, Base64, Hex, Unicode, HTML Entity.
*   **Hashing**: MD5, SHA1, SHA256, SHA512.
*   **JWT Tool**: Decode and analyze JSON Web Tokens instantly.

---

## How to Use

### 1. Installation
1.  Download or build the extension (`dist/chrome` or `dist/firefox`).
2.  Open your browser's Extension Management page:
    *   **Chrome**: `chrome://extensions` -> Enable "Developer Mode" -> "Load unpacked".
    *   **Firefox**: `about:debugging` -> "Load Temporary Add-on".

### 2. Basic Workflow
1.  Navigate to a target website (e.g., `http://example.com/login.php`).
2.  Open **Developer Tools** (`F12` or `Ctrl+Shift+I`) and look for the **HackBar** tab.
3.  **LOAD**: Click `Load` (or `Alt+A`) to grab the current URL and POST data.
4.  **MODIFY**: 
    -   Select a parameter value (e.g., `user=1`).
    -   Choose a payload from the menus (e.g., **SQLi** -> **Union Select**).
    -   Or use **Smart Inject** to fuzz all parameters at once.
5.  **EXECUTE**: Click `Execute` (or press `Ctrl+Enter`) to send the crafted request.

### 3. Pro Tips
*   **Smart Inject**: Click the "Smart Inject" button, type your test payload (e.g., `'`), and watch it populate every field (`?id=1'` `&search='` etc.) and auto-submit.
*   **Shortcuts**:
    *   `Alt + A`: Load URL
    *   `Alt + X` or `Ctrl + Enter`: Execute Request
    *   `Alt + S`: Split URL params for easier reading

---

## Development & Building

**Requirements**: Node.js 16+, pnpm (recommended) or yarn.

```bash
# Clone the repository
git clone https://github.com/your-username/hackbar-pro.git
cd hackbar-pro

# Install dependencies
pnpm install

# Build for Chrome
pnpm run build:chrome

# Build for Firefox
pnpm run build:firefox
```
The output will be in `dist/chrome` or `dist/firefox`.

---

## Contributing
Contributions are welcome! Please submit Pull Requests to add new payloads, fix bugs, or improve the UI.

## License
MIT License. Use responsibly for educational and authorized testing purposes only.
