import React, { useRef, useEffect, useState } from "react";

type PopoverProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
};

const Popover: React.FC<PopoverProps> = ({ isOpen, onClose, anchorRef }) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    if (anchorRef.current && popoverRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();

      setPosition({
        top: anchorRect.bottom + window.scrollY + 4,
        left: anchorRect.left + window.scrollX - popoverRect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);

      document.addEventListener("mousedown", (e) => {
        if (
          popoverRef.current &&
          !popoverRef.current.contains(e.target as Node) &&
          anchorRef.current &&
          !anchorRef.current.contains(e.target as Node)
        ) {
          onClose();
        }
      });

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute bg-white border shadow-md rounded p-4 z-50"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="p-4 pt-0 space-y-4 text-sm max-h-96 overflow-auto max-w-96">
        <div>
            <h3 className="font-semibold mb-1">Le problème du flot maximal</h3>
            <p className="text-gray-700">
            Ce problème consiste à trouver la quantité maximale de flux qui peut circuler 
            d'une source à un puits dans un réseau.
            </p>
        </div>
        
        <div>
            <h3 className="font-semibold mb-1">Comment utiliser cette application</h3>
            <ol className="list-decimal pl-5 text-gray-700 space-y-1">
            <li>Ajustez les nœuds intermédiaires</li>
            <li>Ajoutez des arcs entre les nœuds avec leurs capacités</li>
            <li>Valider le graph</li>
            </ol>
        </div>
        
        <div>
            <h3 className="font-semibold mb-1">Légende des nœuds</h3>
            <ul className="text-gray-700 space-y-1">
            <li>
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <strong>α</strong> (alpha) : La source du réseau
            </li>
            <li>
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <strong>ω</strong> (omega) : Le puits du réseau
            </li>
            <li>
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <strong>A, B, C, ...</strong> : Nœuds intermédiaires
            </li>
            </ul>
        </div>

        <div>
            <h3 className="font-semibold mb-1">Légende des arcs</h3>
            <ul className="text-gray-700 space-y-1">
            <li>
                <span className="inline-block w-6 h-1 bg-gray-500 mr-2"></span>
                : arc inutilisé
            </li>
            <li>
                <span className="inline-block w-6 h-1 bg-red-500 mr-2"></span>
                : arc saturé
            </li>
            <li>
                <span className="inline-block w-6 h-1 bg-blue-500 mr-2"></span>
                : arc non nul
            </li>
            </ul>
        </div>
        
      </div>
    </div>
  );
};

export default Popover;
