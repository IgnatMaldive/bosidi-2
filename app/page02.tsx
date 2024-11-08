// components/Editor/Editor.tsx

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlignLeft,
  Bold,
  File,
  Folder,
  Heading1,
  Italic,
  Link,
  List,
  ListOrdered,
  Menu,
  Moon,
  Plus,
  Sun,
  Cat,
  Settings,
  RefreshCcw,
} from "lucide-react";

export default function Editor() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [activeTools, setActiveTools] = React.useState<string[]>([]);
  const [files, setFiles] = React.useState<{ [key: string]: string }>({});
  const [currentFile, setCurrentFile] = React.useState("");
  const [editorContent, setEditorContent] = React.useState("");
  const [showChat, setShowChat] = React.useState(false);

  // Load files from local storage on mount
  React.useEffect(() => {
    loadFiles();
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleChat = () => setShowChat(!showChat);

  const loadFiles = () => {
    const storedFiles = JSON.parse(localStorage.getItem("files") || "{}");
    setFiles(storedFiles);
    if (Object.keys(storedFiles).length > 0) {
      const firstFile = Object.keys(storedFiles)[0];
      setCurrentFile(firstFile);
      setEditorContent(storedFiles[firstFile]);
    }
  };

  const toggleTool = (tool: string) => {
    setActiveTools((prev) => (prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]));
    document.execCommand(tool); // Apply text formatting command
  };

  const saveFile = () => {
    if (currentFile) {
      const updatedFiles = { ...files, [currentFile]: editorContent };
      setFiles(updatedFiles);
      localStorage.setItem("files", JSON.stringify(updatedFiles));
      alert(`File "${currentFile}" saved!`);
    }
  };

  const addNewFile = () => {
    const fileName = `Untitled-${Object.keys(files).length + 1}`;
    const updatedFiles = { ...files, [fileName]: "" };
    setFiles(updatedFiles);
    setCurrentFile(fileName);
    setEditorContent("");
    localStorage.setItem("files", JSON.stringify(updatedFiles));
  };

  const selectFile = (file: string) => {
    setCurrentFile(file);
    setEditorContent(files[file]);
  };

  const deleteFile = (fileName: string) => {
    const updatedFiles = { ...files };
    delete updatedFiles[fileName];
    setFiles(updatedFiles);
    localStorage.setItem("files", JSON.stringify(updatedFiles));

    if (currentFile === fileName) {
      const remainingFiles = Object.keys(updatedFiles);
      const newCurrentFile = remainingFiles.length > 0 ? remainingFiles[0] : "";
      setCurrentFile(newCurrentFile);
      setEditorContent(newCurrentFile ? updatedFiles[newCurrentFile] : "");
    }
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
      <header className="flex items-center justify-between p-2 bg-background border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-4 w-4 text-foreground" />
          </Button>
          <h1 className="text-lg font-semibold ml-2 text-foreground">Obsidian Clone</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className={`ml-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"} p-2 rounded-lg`}
            onClick={saveFile}
          >
            <Plus className="h-4 w-4 mr-2" /> Save
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleChat}>
            <Cat className="h-4 w-4 text-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={loadFiles}>
            <RefreshCcw className="h-4 w-4 text-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4 text-foreground" />
          </Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <aside className="w-64 border-r bg-background">
            <div className="p-2">
              <Input placeholder="Search files..." />
              <Button
                className={`mt-2 w-full ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
                variant="ghost"
                onClick={addNewFile}
              >
                <Plus className="h-4 w-4 mr-2" /> New File
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="p-2">
                {Object.keys(files).map((file) => (
                  <div key={file} className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <div onClick={() => selectFile(file)} className="flex items-center">
                      <File className="h-4 w-4 mr-2 text-foreground" />
                      <span className="text-foreground">{file}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteFile(file)}>
                      <Plus className="h-4 w-4 rotate-45" /> {/* Delete button */}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </aside>
        )}
        <main className="flex-1 overflow-auto bg-background">
          <Card className="rounded-none border-0 shadow-none">
            <CardHeader className="p-2 border-b">
              <TooltipProvider>
                <div className="flex items-center gap-1">
                  <Button variant={activeTools.includes("bold") ? "secondary" : "ghost"} size="icon" onClick={() => toggleTool("bold")} className="h-8 w-8">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant={activeTools.includes("italic") ? "secondary" : "ghost"} size="icon" onClick={() => toggleTool("italic")} className="h-8 w-8">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant={activeTools.includes("heading") ? "secondary" : "ghost"} size="icon" onClick={() => toggleTool("heading")} className="h-8 w-8">
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button variant={activeTools.includes("bullet-list") ? "secondary" : "ghost"} size="icon" onClick={() => toggleTool("insertUnorderedList")} className="h-8 w-8">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant={activeTools.includes("numbered-list") ? "secondary" : "ghost"} size="icon" onClick={() => toggleTool("insertOrderedList")} className="h-8 w-8">
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Link className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Insert Link</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </CardHeader>
            <CardContent className="p-4">
              <div
                className="min-h-[calc(100vh-16rem)] border-none focus-visible:ring-0"
                contentEditable
                onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: editorContent }}
              />
            </CardContent>
          </Card>
        </main>
      </div>
      <footer className="p-2 bg-background border-t text-sm text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>Words: {editorContent.split(" ").filter((word) => word.length > 0).length}</span>
          <span>Characters: {editorContent.length}</span>
        </div>
      </footer>

      {showChat && (
        <div className="fixed bottom-4 right-4 w-80 bg-background border shadow-lg rounded-lg">
          <div className="flex justify-between items-center p-3 border-b bg-muted-foreground text-white">
            <span className="font-semibold">Chat</span>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
              <Plus className="h-4 w-4 rotate-45" />
            </Button>
          </div>
          <div className="p-3">
            <p className="text-sm text-muted-foreground">How can I assist you today?</p>
            <div className="mt-3">
              <Input placeholder="Type a message..." className="w-full" />
              <Button className="mt-2 w-full">Send</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
