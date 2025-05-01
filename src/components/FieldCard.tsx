import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";

type Node = {
  id: string;
};

type FieldCardProps = {
  onValueChange: (value: number) => void;
  nodes: Node[];
};

const FieldCard: React.FC<FieldCardProps> = ({ onValueChange, nodes }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const intermediateNodesCount = nodes.filter(
      node => node.id !== "start" && node.id !== "end"
    ).length;
    setValue(intermediateNodesCount);
  }, [nodes]);

  const increaseValue = () => {
    if (value < 26) {
      const newValue = value + 1;
      setValue(newValue);
      onValueChange(newValue);
    }
  };

  const decreaseValue = () => {
    if (value > 0) {
      const newValue = value - 1;
      setValue(newValue);
      onValueChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (newValue >= 0 && newValue <= 26) {
      setValue(newValue);
      onValueChange(newValue);
    }
  };

  return (
    <div className="inline-flex items-center gap-6 p-3 rounded-lg border border-gray-200">
      <label className="text-md font-medium text-[#166cb7] whitespace-nowrap">
        Nombre de sommets :
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={decreaseValue}
          disabled={value === 0}
          className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus size={16} />
        </button>
        <input
          type="number"
          min="0"
          max="26"
          value={value}
          onChange={handleInputChange}
          className="w-16 px-3 py-2 text-center bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={increaseValue}
          disabled={value === 26}
          className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default FieldCard;