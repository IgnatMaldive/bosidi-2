// components/Editor/Editor.tsx

"use client";
import { useEffect, useState } from "react";
import { AiOutlineBold, AiOutlineItalic, AiOutlineUnderline } from "react-icons/ai";
import { FiFile, FiFolderPlus, FiSave, FiX } from "react-icons/fi";
import { BiChat } from "react-icons/bi";
import styles from "./Editor.module.css"; // Import the CSS module

const Editor = () => {
  // State for storing documents
  const [files, setFiles] = useState<{ [key: string]: string }>({});
  const [currentFile, setCurrentFile] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);

  // Load files from local storage when the component mounts
  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("files") || "{}");
    setFiles(storedFiles);
    // Set the first file as the current file if any files exist
    if (Object.keys(storedFiles).length > 0) {
      const firstFile = Object.keys(storedFiles)[0];
      setCurrentFile(firstFile);
      setEditorContent(storedFiles[firstFile]);
    }
  }, []);

  // Save current file to local storage
  const saveFile = () => {
    if (currentFile) {
      const updatedFiles = { ...files, [currentFile]: editorContent };
      setFiles(updatedFiles);
      localStorage.setItem("files", JSON.stringify(updatedFiles));
      alert(`File "${currentFile}" saved!`);
    }
  };

  // Add a new file
  const addNewFile = () => {
    const fileName = `Untitled-${Object.keys(files).length + 1}`;
    setFiles({ ...files, [fileName]: "" });
    setCurrentFile(fileName);
    setEditorContent("");
    // Update local storage with the new file
    localStorage.setItem("files", JSON.stringify({ ...files, [fileName]: "" }));
  };

  // Delete a file
  const deleteFile = (fileName: string) => {
    const updatedFiles = { ...files };
    delete updatedFiles[fileName];
    setFiles(updatedFiles);
    localStorage.setItem("files", JSON.stringify(updatedFiles));

    // Update current file and editor content if the deleted file was open
    if (currentFile === fileName) {
      const remainingFiles = Object.keys(updatedFiles);
      const newCurrentFile = remainingFiles.length > 0 ? remainingFiles[0] : "";
      setCurrentFile(newCurrentFile);
      setEditorContent(updatedFiles[newCurrentFile] || "");
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <button onClick={addNewFile}><FiFolderPlus /> New File</button>
        </div>
        <div className={styles.fileList}>
          {Object.keys(files).map((file) => (
            <div
              key={file}
              onClick={() => {
                setCurrentFile(file);
                setEditorContent(files[file]);
              }}
              className={currentFile === file ? styles.activeFile : ""}
            >
              <FiFile /> {file}
              <button onClick={() => deleteFile(file)}><FiX /></button>
            </div>
          ))}
        </div>
      </aside>

      {/* Editor */}
      <main className={styles.editor}>
        <div className={styles.editorHeader}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className={styles.searchInput}
          />
          <button onClick={saveFile}><FiSave /> Save</button>
          <button onClick={() => setShowChat(!showChat)}><BiChat /> Chat</button>
        </div>

        {/* Text Formatting Toolbar */}
        <div className={styles.toolbar}>
          <button
            onClick={() => document.execCommand("bold")}
            title="Bold"
          >
            <AiOutlineBold />
          </button>
          <button
            onClick={() => document.execCommand("italic")}
            title="Italic"
          >
            <AiOutlineItalic />
          </button>
          <button
            onClick={() => document.execCommand("underline")}
            title="Underline"
          >
            <AiOutlineUnderline />
          </button>
        </div>

        {/* Content Editable Div for Editing */}
        <div
          className={styles.textArea}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setEditorContent((e.target as HTMLDivElement).innerText)}
          dangerouslySetInnerHTML={{ __html: editorContent }}
        />

        {/* Chat Popup */}
        {showChat && (
          <div className={styles.chatPopup}>
            <div className={styles.chatHeader}>
              <span>Chat</span>
              <button onClick={() => setShowChat(false)}><FiX /></button>
            </div>
            <div className={styles.chatBody}>
              <p><strong>Support:</strong> How can I assist you?</p>
              {/* More chat functionality can be added here */}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Editor;
