import React from "react";
import { messageTypes } from "configs/constants";
import OwnMessage from "./Own";
import OppositeMessage from "./Opposite";
import ServiceMessage from "./Service";

const messageTypesAsArray = Object.values(messageTypes)
const messageComponents = {
  [messageTypes.OWN]: OwnMessage,
  [messageTypes.OPPOSITE]: OppositeMessage,
  [messageTypes.SERVICE]: ServiceMessage
}

function Message({ message }) {
  if (!messageTypesAsArray.includes(message.type)) return null // return layout for 'broken' message

  const MessageComponent = messageComponents[message.type]
  return <MessageComponent message={message}/>

}

export default Message;
