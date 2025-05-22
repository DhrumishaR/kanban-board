import React, { use, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { List } from "./KanBan";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface AddCardsProps {
  list: List;
  setShowAddCard: React.Dispatch<React.SetStateAction<boolean>>;
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
    if (cardText === "") {
      window.addEventListener('keydown', ()=>setShowAddCard(true))
      
    }

    const newCard = {
      id: uuidv4(),
      text: cardText,
      completed: false,
    };

    const getList = localStorage.getItem("lists");
    const parsedList = JSON.parse(getList || "[]");
    const findIndex = parsedList.findIndex((l: List) => l.id === list.id);
    parsedList[findIndex].cards.push(newCard);
    const updatedLists = [...parsedList];

    localStorage.setItem("lists", JSON.stringify(updatedLists));
    setLists(updatedLists);
    setCardText("");
    setShowAddCard(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Add a card..."
            className="border-black rounded-md p-2 w-full"
            value={cardText}
            onChange={(e) => setCardText(e.target.value)}
          />
          <Button
            type="submit"
            className="h-7 rounded-md bg-black text-white hover:bg-gray-800"
          >
            Add Card
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddCards;
