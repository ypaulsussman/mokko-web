import React from "react";
import DOMPurify from "dompurify";
import marked from "marked";

const TextDisplay = ({ text }) => (
  <div
    className="content"
    dangerouslySetInnerHTML={{
      __html: marked(DOMPurify.sanitize(text)),
    }}
  />
);

export default TextDisplay;
