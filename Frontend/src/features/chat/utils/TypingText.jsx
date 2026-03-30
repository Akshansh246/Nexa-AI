/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

const TypingText = ({ text = "", speed = 20, onUpdate }) => {
  useEffect(() => {
    if (!text) return; // 🛑 prevent crash

    let index = 0;
    let current = "";

    const interval = setInterval(() => {
      current += text.charAt(index);
      onUpdate(current);
      index++;

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text]);

  return null;
};

export default TypingText;