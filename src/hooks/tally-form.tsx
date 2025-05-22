import {useEffect} from "react";

export const useFeedbackForm = () => {
  const loadTallyScript = () => {
    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const openTallyForm = (userId: string, email: string) => {
    // @ts-ignore
    window.Tally.openPopup(`w25YDp`, {
      layout: 'modal',
      width: 600,
      hiddenFields: {
        user_id: userId,
        email,
      }
    });
  }

  useEffect(() => {
    loadTallyScript();
  }, []);

  return openTallyForm
}

