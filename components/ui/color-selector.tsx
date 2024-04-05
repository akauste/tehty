import { Dispatch } from "react";

export enum Colors {
  Slate = "#94a3b8", // slate-400
  Red = "#f87171", // red-400
  Amber = "#fbbf24", // amber-400
  Lime = "#a3e635", // lime-400
  Emerald = "#34d399", // emerald-400
  Cyan = "#22d3ee", // cyan-400
  Blue = "#60a5fa", // blue-400
  Violet = "#a78bfa", // violet-400
  Fuchsia = "#e879f9", // fuchsia-400
  Rose = "#fb7185", // rose-400
}

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
          title={c}
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
