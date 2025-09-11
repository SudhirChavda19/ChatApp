import Avatar from "boring-avatars";
import { useEffect, useState } from "react";

export default function UserAvatar({ name, size }) {
  const [randomColor, setRandomColor] = useState([]);

  const stringToHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  // Convert hash → hex color
  const hashToColor = (hash, offset = 0) => {
    const value = (hash >> offset) & 0xffffff; // 24-bit
    return "#" + ("000000" + value.toString(16)).slice(-6);
  };

  // Generate 5 fixed colors for a given user
  const generateUserColors = (userName) => {
    const hash = stringToHash(userName);
    return [
      hashToColor(hash, 0),
      hashToColor(hash, 6),
      hashToColor(hash, 12),
      hashToColor(hash, 18),
      "#FFFFFF", // keep white for balance
    ];
  };

  useEffect(() => {
    if(name){

      setRandomColor(generateUserColors(name));
    }
  }, [name]);

  return (
    <Avatar name={name} size={size} variant="marble" colors={randomColor} />
  );
}
