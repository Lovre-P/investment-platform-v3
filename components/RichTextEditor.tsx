import React, { useRef, useEffect, useState } from 'react';
import { 
  BoldIcon, 
  ItalicIcon, 
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
  label?: string;
  showCharCount?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter text...",
  rows = 4,
  maxLength,
  className = "",
  label,
  showCharCount = false
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selection, setSelection] = useState<Range | null>(null);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Save selection before losing focus
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSelection(sel.getRangeAt(0).cloneRange());
    }
  };

  // Restore selection
  const restoreSelection = () => {
    if (selection) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(selection);
    }
  };

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;

      // Check max length if specified
      if (maxLength) {
        const textContent = editorRef.current.textContent || '';
        if (textContent.length > maxLength) {
          // Truncate content if it exceeds max length
          const truncatedText = textContent.substring(0, maxLength);
          editorRef.current.textContent = truncatedText;
          return;
        }
      }

      onChange(content);
    }
  };

  // Handle paste events to preserve formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    
    const clipboardData = e.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');
    
    // If HTML data is available, use it (preserves formatting)
    if (htmlData) {
      // Basic sanitization - remove script tags and dangerous attributes
      const sanitized = htmlData
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<style[^>]*>.*?<\/style>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:/gi, '');
      
      document.execCommand('insertHTML', false, sanitized);
    } else {
      // Fallback to plain text
      document.execCommand('insertText', false, textData);
    }
    
    handleInput();
  };

  // Format text with given command
  const formatText = (command: string, value?: string) => {
    restoreSelection();
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  // Insert list
  const insertList = (ordered: boolean) => {
    restoreSelection();
    document.execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList');
    editorRef.current?.focus();
    handleInput();
  };

  // Insert link
  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      restoreSelection();
      document.execCommand('createLink', false, url);
      editorRef.current?.focus();
      handleInput();
    }
  };

  // Get character count
  const getCharCount = () => {
    return editorRef.current?.textContent?.length || 0;
  };

  // Toolbar button component
  const ToolbarButton: React.FC<{
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    active?: boolean;
  }> = ({ onClick, icon: Icon, title, active = false }) => (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()} // Prevent losing focus
      className={`p-2 rounded border transition-colors ${
        active 
          ? 'bg-primary-100 border-primary-300 text-primary-700' 
          : 'bg-white border-secondary-300 text-secondary-600 hover:bg-secondary-50'
      }`}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className={`rich-text-editor ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
        </label>
      )}
      
      {/* Toolbar */}
      <div className="border border-secondary-300 rounded-t-lg bg-secondary-50 p-2 flex items-center gap-1 flex-wrap">
        <div className="flex items-center gap-1 border-r border-secondary-300 pr-2 mr-2">
          <ToolbarButton
            onClick={() => formatText('bold')}
            icon={BoldIcon}
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => formatText('italic')}
            icon={ItalicIcon}
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => formatText('underline')}
            icon={UnderlineIcon}
            title="Underline (Ctrl+U)"
          />
        </div>
        
        <div className="flex items-center gap-1 border-r border-secondary-300 pr-2 mr-2">
          <ToolbarButton
            onClick={() => insertList(false)}
            icon={ListBulletIcon}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => insertList(true)}
            icon={NumberedListIcon}
            title="Numbered List"
          />
        </div>
        
        <div className="flex items-center gap-1 border-r border-secondary-300 pr-2 mr-2">
          <ToolbarButton
            onClick={insertLink}
            icon={LinkIcon}
            title="Insert Link"
          />
        </div>
        
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            icon={isPreviewMode ? PencilIcon : EyeIcon}
            title={isPreviewMode ? "Edit Mode" : "Preview Mode"}
            active={isPreviewMode}
          />
        </div>
      </div>

      {/* Editor/Preview Area */}
      {isPreviewMode ? (
        <div 
          className="border border-t-0 border-secondary-300 rounded-b-lg p-3 bg-white min-h-[100px] prose prose-sm max-w-none"
          style={{ minHeight: `${rows * 1.5}rem` }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onBlur={saveSelection}
          className="border border-t-0 border-secondary-300 rounded-b-lg p-3 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          style={{ minHeight: `${rows * 1.5}rem` }}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
        />
      )}
      
      {/* Character count */}
      {showCharCount && (
        <div className="flex justify-between items-center mt-1 text-xs text-secondary-500">
          <span>
            {getCharCount()}{maxLength ? `/${maxLength}` : ''} characters
          </span>
        </div>
      )}

      {/* Inline styles for better formatting */}
      <style jsx>{`
        .rich-text-editor [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }

        .rich-text-editor [contenteditable] {
          line-height: 1.5;
        }

        .rich-text-editor [contenteditable] p {
          margin: 0.5em 0;
        }

        .rich-text-editor [contenteditable] ul,
        .rich-text-editor [contenteditable] ol {
          margin: 0.5em 0;
          padding-left: 1.5em;
        }

        .rich-text-editor [contenteditable] li {
          margin: 0.25em 0;
        }

        .rich-text-editor [contenteditable] a {
          color: #2563eb;
          text-decoration: underline;
        }

        .rich-text-editor [contenteditable] strong,
        .rich-text-editor [contenteditable] b {
          font-weight: 600;
        }

        .rich-text-editor [contenteditable] em,
        .rich-text-editor [contenteditable] i {
          font-style: italic;
        }

        .rich-text-editor [contenteditable] u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
