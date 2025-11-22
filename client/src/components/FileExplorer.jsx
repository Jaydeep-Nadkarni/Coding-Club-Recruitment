import React, { useState } from 'react';
import { Folder, FileCode, ChevronRight, ChevronDown, File } from 'lucide-react';

const FileItem = ({ name, type, depth, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const paddingLeft = `${depth * 1.5}rem`;

  const toggleOpen = () => setIsOpen(!isOpen);

  const getIcon = () => {
    if (type === 'folder') return isOpen ? <Folder size={16} className="text-primary-500" /> : <Folder size={16} className="text-primary-500" />;
    if (name.endsWith('.jsx') || name.endsWith('.js')) return <FileCode size={16} className="text-editor-yellow" />;
    if (name.endsWith('.css')) return <FileCode size={16} className="text-editor-cyan" />;
    if (name.endsWith('.html')) return <FileCode size={16} className="text-editor-orange" />;
    return <File size={16} className="text-dark-400" />;
  };

  return (
    <div>
      <div 
        className={`
          flex items-center py-1 px-2 cursor-pointer hover:bg-dark-100 dark:hover:bg-dark-700 text-sm text-dark-700 dark:text-dark-300
          transition-colors duration-150
        `}
        style={{ paddingLeft }}
        onClick={type === 'folder' ? toggleOpen : undefined}
      >
        <span className="mr-1 w-4 flex justify-center">
          {type === 'folder' && (
            isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          )}
        </span>
        <span className="mr-2">{getIcon()}</span>
        <span className="truncate">{name}</span>
      </div>
      {isOpen && children && (
        <div>{children}</div>
      )}
    </div>
  );
};

const FileExplorer = () => {
  // Mock file system structure
  const files = [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Button.jsx', type: 'file' },
            { name: 'Input.jsx', type: 'file' },
            { name: 'Layout.jsx', type: 'file' },
          ]
        },
        {
          name: 'pages',
          type: 'folder',
          children: [
            { name: 'Dashboard.jsx', type: 'file' },
            { name: 'Login.jsx', type: 'file' },
            { name: 'Profile.jsx', type: 'file' },
          ]
        },
        { name: 'App.jsx', type: 'file' },
        { name: 'main.jsx', type: 'file' },
        { name: 'index.css', type: 'file' },
      ]
    },
    { name: 'package.json', type: 'file' },
    { name: 'vite.config.js', type: 'file' },
    { name: 'README.md', type: 'file' },
  ];

  const renderTree = (items, depth = 0) => {
    return items.map((item, index) => (
      <FileItem key={`${item.name}-${index}`} name={item.name} type={item.type} depth={depth}>
        {item.children && renderTree(item.children, depth + 1)}
      </FileItem>
    ));
  };

  return (
    <div className="py-2 select-none">
      <div className="px-4 py-2 text-xs font-bold text-dark-500 uppercase tracking-wider mb-2">
        Explorer
      </div>
      {renderTree(files)}
    </div>
  );
};

export default FileExplorer;
