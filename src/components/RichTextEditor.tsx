import "react-quill/dist/quill.snow.css";
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill only on the client side
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return <ReactQuill theme="snow" value={value} onChange={onChange} />;
};

export default RichTextEditor;

// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// interface RichTextEditorProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
//   return <ReactQuill theme="snow" value={value} onChange={onChange} />;
// };

// export default RichTextEditor;
