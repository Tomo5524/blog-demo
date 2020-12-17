import React from "react";
import renderHTML from "react-render-html";

export default function Content({ text }) {
  return (
    <div className="content" dangerouslySetInnerHTML={{ __html: text }}></div>
  );
}
