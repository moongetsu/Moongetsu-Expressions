<h1 align="center">
  <img src="https://images.gamebanana.com/img/ico/sprays/naruto.gif" width="64" alt="Moongetsu Expression"/>
  <br />
  Moongetsu Expression
</h1>
<p align="center">
  <b>A clean, <span style="color:#f1c40f;">modular</span> expression library for After Effects.</b><br>
  <i>Save, organize, edit, and apply your favorite expressions without digging through loose files.</i>
</p>

<hr>

## 🎬 About

**Moongetsu Expression** is a CEP extension for After Effects that helps you keep your expressions in one easy place. Instead of copying code from random `.txt` or `.jsx` files, you can save expressions into folders, apply them from the panel, edit them later, and back up or restore your library when needed.

---

## 🚀 Key Features

### 📁 Advanced Library Management
- **Folder-Based Library:** Categories are stored as folders on disk, so your saved expressions stay easy to find and move.
- **Name Checks:** The Register tab warns you when a preset name already exists in the selected folder.
- **Direct Editing:** Rename presets or update their expression code from the Manage tab without deleting and saving them again.
- **Import Review:** When imported presets conflict with existing ones, you can compare the old and new code before merging.

### 🛠️ Professional Toolset
- **Expression Scanner:** Scans the selected layer and lists properties that currently have expressions.
- **Search & Replace:** Replace text inside expressions across the active composition.
- **Deep Revert:** Removes expressions and related control effects from selected layers.
- **Quick Reset:** Reset individual property expressions after scanning a selected layer.

### ⚙️ Deep Customization
- **Custom Prefix:** Change the prefix used for control effects, such as `M_Amp` or `M_Freq`.
- **Custom Storage Folder:** Pick where your library is stored, including a synced folder if you want to use one.
- **UI Options:** Switch between **Dark Mode**, **Light Mode**, and **Compact Mode**.

---

## 🎯 Full Tool Reference

### Register Tab
| Feature | Function |
|---------|----------|
| **Grab from Layer** | Copies the expression from the selected property in After Effects. |
| **Target Folder** | Choose an existing folder or create a new one from the panel. |
| **Validation** | Shows a warning if the preset name already exists in that folder. |

### Tools Tab
| Action | Description |
|--------|-------------|
| **Scan Layer** | Lists active expressions on the selected layer with a short code preview. |
| **Replace All** | Runs find and replace on expressions in the active composition. |
| **Reset Prop** | Clears one property's expression without touching the rest of the layer. |
| **Revert Layer** | Removes expressions and linked control effects from selected layers. |
| **Clear Comp** | Clears expressions from selected expression-capable properties. |

### Settings Tab
| Control | Impact |
|---------|--------|
| **Expression Prefix** | The prefix used for generated control names. Default: `M_`. |
| **Storage Path** | Change where your library and settings are stored. |
| **UI Themes** | Toggle between dark, light, and compact layouts. |
| **Import/Export** | Back up your custom library to JSON or import presets from a JSON file. |

---

## 📦 Installation

1. **Download:** Download the [latest release](https://github.com/Moongetsu/Moongetsu-Expressions/releases).
2. **Path:** Go to `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions`.
3. **Copy:** Paste the folder there (if the `CEP` or `extensions` folder is not there, create them manually).
4. **Open:** In After Effects, go to `Window > Extensions > Moongetsu Library`.
5. **Preferences:** Enable `Allow Scripts to Write Files` in `Preferences > Scripting & Expressions`.

---

## 📸 Interface Preview

<p align="center">
  <img src="https://media.discordapp.net/attachments/977518313217347604/1458920132721246432/Screenshot_18.png?ex=696164c1&is=69601341&hm=db094b6096dbde442324d5f0e09ac93db12a130339f64f33ebb4ea3edac4c3d7&=&format=webp&quality=lossless" alt="Moongetsu Library Manage" />
  <br />
  <sub><i>Library management with folder navigation</i></sub>
</p>

---

<p align="center">
  <img src="https://badgen.net/badge/Built%20for/After%20Effects/red?icon=adobe" alt="After Effects" />
  <img src="https://badgen.net/badge/Tech/CEP%20Extension/gold" alt="CEP" />
  <img src="https://badgen.net/badge/Safety/Conflict%20Detector/green" alt="Safety" />
  <img src="https://badgen.net/badge/Sync/Mirroring/blue" alt="Sync" />
</p>