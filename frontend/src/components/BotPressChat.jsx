/*import { useEffect } from "react";

const BotpressChat = () => {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v3.0/inject.js";
    script1.defer = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://files.bpcontent.cloud/2025/06/30/04/20250630042421-R011RS1G.js";
    script2.defer = true;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return null; 
};

export default BotpressChat;*/

import { useEffect } from "react";

const BotpressChat = () => {
  useEffect(() => {
    // Check if the script is already injected
    if (window.botpressWebChat) return;

    // Load inject.js
    const injectScript = document.createElement("script");
    injectScript.src = "https://cdn.botpress.cloud/webchat/v3.0/inject.js";
    injectScript.defer = true;

    injectScript.onload = () => {
      // Once inject.js is loaded, load config script
      const configScript = document.createElement("script");
      configScript.src = "https://files.bpcontent.cloud/2025/06/30/04/20250630042421-R011RS1G.js";
      configScript.defer = true;
      document.body.appendChild(configScript);
    };

    document.body.appendChild(injectScript);

    // Clean up if component unmounts
    return () => {
      if (injectScript) document.body.removeChild(injectScript);
    };
  }, []);

  return null;
};

export default BotpressChat;

