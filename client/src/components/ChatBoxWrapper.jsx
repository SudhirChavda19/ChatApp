import { useParams } from "react-router-dom";
import ChatBox from "./ChatBox";

function ChatBoxWrapper() {
  const { id } = useParams();
  return <ChatBox key={id} />;
}

export default ChatBoxWrapper;
