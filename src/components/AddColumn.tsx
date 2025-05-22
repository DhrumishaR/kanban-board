import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { List } from "./KanBan";
import { Plus, X } from "lucide-react";

interface AddColumnProps {
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
}

const AddColumn: React.FC<AddColumnProps> = ({ lists, setLists }) => {
  const [listTitle, setListTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!listTitle.trim()) {
      toast.error("Please enter a list title");
      return;
    }
    
    // Check for duplicate list titles
    if (lists.some((list) => list.title.toLowerCase() === listTitle.toLowerCase())) {
      toast.error("A list with this name already exists");
      return;
    }

    const newList: List = {
      id: uuidv4(),
      title: listTitle,
      cards: [],
    };

    setLists((prevLists) => [...prevLists, newList]);
    toast.success(`List "${listTitle}" created successfully`);
    setListTitle("");
    setIsAdding(false);
  };

  return (
    <div className="mb-6">
      {isAdding ? (
        <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in">
          <form className="flex flex-col gap-3" onSubmit={handleAddList}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-700">Create New Column</h3>
            </div>
            
            <Input
              type="text"
              placeholder="Enter List Title"
              className="h-10 rounded-md border-gray-200 bg-white"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              autoFocus
            />
            
            <div className="flex gap-2">
              <Button
                type="submit"
                className="h-8 rounded-md bg-black text-white hover:bg-gray/90"
              >
                Create Column
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-8   rounded-md border-gray-200"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <Plus size={16} />
          Add New Column
        </Button>
      )}
    </div>
  );
};

export default AddColumn;