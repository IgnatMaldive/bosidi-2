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
  ChevronDown,
  File,
  Folder,
  Hash,
  Heading1,
  Italic,
  Link,
  List,
  ListOrdered,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
} from "lucide-react";

export default function Editor() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [activeTools, setActiveTools] = React.useState<string[]>([]);
  const [files, setFiles] = React.useState<{ [key: string]: string }>({});
  const [currentFile, setCurrentFile] = React.useState("");
  const [editorContent, setEditorContent] = React.useState("");

  React.useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("files") || "{}");
    setFiles(storedFiles);
    if (Object.keys(storedFiles).length > 0) {
      setCurrentFile(Object.keys(storedFiles)[0]);
      setEditorContent(storedFiles[Object.keys(storedFiles)[0]]);
    }
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleTool = (tool: string) => {
    setActiveTools((prev) => (prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]));
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
    setFiles({ ...files, [fileName]: "" });
    setCurrentFile(fileName);
    setEditorContent("");
    localStorage.setItem("files", JSON.stringify({ ...files, [fileName]: "" }));
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
          <Button variant="ghost" size="icon" onClick={saveFile}>
            <Plus className="h-4 w-4 text-foreground" /> Save
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
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
              <Button className="mt-2 w-full" variant="ghost" onClick={addNewFile}>
                <Plus className="h-4 w-4 mr-2" /> New File
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="p-2">
                <Accordion type="single" collapsible className="w-full">
                  {Object.keys(files).map((file) => (
                    <AccordionItem key={file} value={file}>
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center">
                          <Folder className="h-4 w-4 mr-2" />
                          <span className="text-foreground">{file}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-4 space-y-2">
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => {
                              setCurrentFile(file);
                              setEditorContent(files[file]);
                            }}
                          >
                            <File className="h-4 w-4 mr-2" />
                            <span className="text-foreground text-sm">{file}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </ScrollArea>
          </aside>
        )}
        <main className="flex-1 overflow-auto bg-background">
          <Card className="rounded-none border-0 shadow-none">
            <CardHeader className="p-2 border-b">
              <TooltipProvider>
                <div className="flex items-center gap-1">
                  <Button
                    variant={activeTools.includes("bold") ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => toggleTool("bold")}
                    className="h-8 w-8"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeTools.includes("italic") ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => toggleTool("italic")}
                    className="h-8 w-8"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button
                    variant={activeTools.includes("heading") ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => toggleTool("heading")}
                    className="h-8 w-8"
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeTools.includes("bullet-list") ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => toggleTool("bullet-list")}
                    className="h-8 w-8"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeTools.includes("numbered-list") ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => toggleTool("numbered-list")}
                    className="h-8 w-8"
                  >
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
              <Textarea
                className="min-h-[calc(100vh-16rem)] resize-none border-none focus-visible:ring-0"
                placeholder="Start writing your note here..."
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
              />
            </CardContent>
          </Card>
        </main>
      </div>
      <footer className="p-2 bg-background border-t text-sm text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>Words: {editorContent.split(" ").length}</span>
          <span>Characters: {editorContent.length}</span>
        </div>
      </footer>
    </div>
  );
}
