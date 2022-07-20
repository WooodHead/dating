import { useMemo } from "react";

function MsgText({ message }) {
  const msgText = useMemo(() => {
    return message.split('\n');
  }, []);
  
  return (
    msgText.map((msg, key) => (
      <div key={key}>
        {msg}
      </div>
    ))
  );
}

export default MsgText;
