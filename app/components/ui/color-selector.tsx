import { Dispatch } from "react";

interface ColorSelectorProps {
  colors: string[];
  color: string;
  setColor: Dispatch<string>;
}
const ColorSelector = ({ colors, color, setColor }: ColorSelectorProps) => {
  return (
    <div className="flex flex-row gap-1">
      {colors.map((c) => (
        <button
          key={c}
          className="w-4 h-4 hover:opacity-50"
          onClick={(e) => {
            e.preventDefault();
            setColor(c);
          }}
          style={{
            backgroundColor: c,
            boxShadow: c == color ? `1px -1px 2px black` : "",
          }}
        ></button>
      ))}
    </div>
  );
};
export default ColorSelector;
