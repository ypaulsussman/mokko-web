import React from "react";
import DOMPurify from "dompurify";
import marked from "marked";

const TextDisplay = ({ text }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: marked(DOMPurify.sanitize(text)),
    }}
  />
);

export default TextDisplay;