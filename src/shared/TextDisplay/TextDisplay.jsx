import React from "react";
import DOMPurify from "dompurify";
import marked from "marked";

export const TextDisplay = ({ text }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: marked(DOMPurify.sanitize(text)),
    }}
  />
);
