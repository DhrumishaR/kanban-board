import React, {  useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { List } from "./KanBan";

interface AddColumnProps {
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
}

const AddColumn: React.FC<AddColumnProps> = ({lists,setLists}) => {
  const [listTitle, setListTitle] = useState("");

  const updateLocalStorage = () => {
    try {
      const stored = localStorage.getItem("lists");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setLists(parsed);
      }
    } catch (err) {
      console.error("Failed to parse localStorage:", err);
    }
  };

  useEffect(() => {
    updateLocalStorage(); 
  }, []);

  const handleAddList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!listTitle.trim()) return;
    const newList: List = {
      id: uuidv4(),
      title: listTitle,
      cards: [],
    };

 if (lists.some((list) => list.title.toLowerCase() === newList.title.toLowerCase())) {
  toast.error("List already exists");  
  return;
}

    localStorage.setItem("lists", JSON.stringify([...lists, newList]));
    updateLocalStorage();
    setListTitle("");
  };

  return (
    <form className="flex w-full max-w-md gap-2" onSubmit={handleAddList}>
      <Input
        type="text"
        placeholder="Enter List Title"
        className="h-10 rounded-md border-gray-200 bg-white"
        value={listTitle}
        onChange={(e) => setListTitle(e.target.value)}
      />
      <Button
        type="submit"
        className="h-10 rounded-md bg-black text-white hover:bg-gray-800"
      >
        Add List
      </Button>
    </form>
  );
};

export default AddColumn;