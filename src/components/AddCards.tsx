import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { List } from "./KanBan";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";

interface AddCardsProps {
  list: List;
  setShowAddCard: (show: boolean) => void;
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
}

const AddCards: React.FC<AddCardsProps> = ({
  list,
  setShowAddCard,
  setLists,
}) => {
  const [cardText, setCardText] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!cardText.trim()) {
      toast.error("Card text cannot be empty");
      return;
    }

    // Check for duplicate cards in the same list
    if (list.cards.some(card => card.text.toLowerCase() === cardText.toLowerCase())) {
      toast.error("A card with this text already exists in this list");
      return;
    }

    const newCard = {
      id: uuidv4(),
      text: cardText,
      completed: false,
    };

    setLists(prevLists => {
      return prevLists.map(l => {
        if (l.id === list.id) {
          return {
            ...l,
            cards: [...l.cards, newCard]
          };
        }
        return l;
      });
    });

    toast.success("Card added successfully");
    setCardText("");
    setShowAddCard(false);
  };

  return (
    <div className="bg-white p-3 rounded-md shadow-sm animate-fade-in">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">Add New Card</h4>
          </div>
          
          <Input
            type="text"
            placeholder="Enter card text..."
            className="border-gray-200 rounded-md p-2 w-full"
            value={cardText}
            onChange={(e) => setCardText(e.target.value)}
            autoFocus
          />
          
          <div className="flex gap-2">
            <Button
              type="submit"
              className="h-7 rounded-md bg-black text-white hover:bg-gray/90 text-sm"
            >
              Add Card
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-7 rounded-md border-gray-200 text-sm"
              onClick={() => setShowAddCard(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCards;
