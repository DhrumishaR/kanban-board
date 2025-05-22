import React, { useState } from "react";
import { List } from "./KanBan";
import { Trash2, Plus, SquarePen, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import AddCards from "./AddCards";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

export interface ColumnListProps {
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
}

const ColumnList: React.FC<ColumnListProps> = ({ lists, setLists }) => {
  const [showAddCardMap, setShowAddCardMap] = useState<Record<string, boolean>>({});
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const handleSetShowAddCard = (listId: string, show: boolean) => {
    setShowAddCardMap((prev) => ({
      ...prev,
      [listId]: show,
    }));
  };

  const handleAddCard = (listId: string) => {
    // Close any other open add card forms
    const newShowAddCardMap = Object.keys(showAddCardMap).reduce((acc, key) => {
      acc[key] = key === listId;
      return acc;
    }, {} as Record<string, boolean>);
    
    setShowAddCardMap({
      ...newShowAddCardMap,
      [listId]: true,
    });
    
    // Cancel any ongoing edits
    setEditingCardId(null);
    setEditingListId(null);
  };

  const handleDeleteCard = (cardId: string, listId: string) => {
    setLists(prevLists => {
      return prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.filter(card => card.id !== cardId)
          };
        }
        return list;
      });
    });
    
    toast.success("Card deleted successfully");
  };

  const handleDeleteColumn = (listId: string, listTitle: string) => {
    const listToDelete = lists.find(list => list.id === listId);
    
    if (!listToDelete) return;
    
    if (listToDelete.cards.length > 0) {
      toast.error("Cannot delete a list with cards. Please remove all cards first.");
      return;
    }
    
    setLists(prevLists => prevLists.filter(list => list.id !== listId));
    toast.success(`List "${listTitle}" deleted successfully`);
  };

  const handleEditCard = (cardId: string, listId: string, newText: string) => {
    if (!newText.trim()) {
      toast.error("Card text cannot be empty");
      return;
    }
    
    // Check for duplicate cards in the same list
    const currentList = lists.find(list => list.id === listId);
    const currentCard = currentList?.cards.find(card => card.id === cardId);
    
    if (currentList && currentCard && newText !== currentCard.text) {
      if (currentList.cards.some(card => 
        card.id !== cardId && card.text.toLowerCase() === newText.toLowerCase()
      )) {
        toast.error("A card with this text already exists in this list");
        return;
      }
    }
    
    setLists(prevLists => {
      return prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId) {
                return { ...card, text: newText };
              }
              return card;
            })
          };
        }
        return list;
      });
    });
    
    toast.success("Card updated successfully");
    setEditingCardId(null);
    setEditingText("");
  };

  const handleToggleCompleted = (cardId: string, listId: string) => {
    setLists(prevLists => {
      return prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId) {
                return { ...card, completed: !card.completed };
              }
              return card;
            })
          };
        }
        return list;
      });
    });
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;
    
    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Handle column reordering
    if (type === "column") {
      const reorderedLists = [...lists];
      const [movedList] = reorderedLists.splice(source.index, 1);
      reorderedLists.splice(destination.index, 0, movedList);
      
      setLists(reorderedLists);
      toast.success("List reordered successfully");
      return;
    }

    // Handle card movement
    const sourceListIndex = lists.findIndex(list => list.id === source.droppableId);
    const destListIndex = lists.findIndex(list => list.id === destination.droppableId);
    
    if (sourceListIndex === -1 || destListIndex === -1) return;
    
    const newLists = [...lists];
    const sourceList = { ...newLists[sourceListIndex] };
    const destList = sourceListIndex === destListIndex 
      ? sourceList 
      : { ...newLists[destListIndex] };
    
    const [movedCard] = sourceList.cards.splice(source.index, 1);
    destList.cards.splice(destination.index, 0, movedCard);
    
    newLists[sourceListIndex] = sourceList;
    if (sourceListIndex !== destListIndex) {
      newLists[destListIndex] = destList;
    }
    
    setLists(newLists);
    
    if (sourceListIndex === destListIndex) {
      toast.success("Card reordered successfully");
    } else {
      toast.success(`Card moved to "${destList.title}"`);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="all-lists" direction="horizontal" type="column">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-6 mt-6 px-4 pb-4 w-full overflow-x-auto min-h-[70vh]"
          >
            {lists.map((list, index) => (
              <Draggable key={list.id} draggableId={list.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-secondary rounded-xl w-72 p-4 flex-shrink-0 shadow-card hover:shadow-card-hover transition-shadow duration-200 h-auto"
                  >
                    <Droppable droppableId={list.id} type="card">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex flex-col gap-2 min-h-[40px]"
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                  <h2 className="text-md font-semibold text-gray-800">
                                    {list.title}
                                  </h2>
                                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                    {list.cards.length}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Trash2
                                    size={16}
                                    className="cursor-pointer text-gray-500 hover:text-error"
                                    onClick={() => handleDeleteColumn(list.id, list.title)}
                                  />
                                </div>
                          </div>

                          {/* Cards */}
                          <div className="flex flex-col gap-2 mb-3">
                            {list.cards.length > 0 ? (
                              list.cards.map((card, index) => (
                                <Draggable
                                  key={card.id}
                                  draggableId={card.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`bg-card rounded-md p-3 w-full shadow-sm 
 
                                        ${card.completed ? "bg-gray-50" : ""}
                                        transition-all duration-200 hover:shadow-md`}
                                    >
                                      {editingCardId === card.id ? (
                                        <div className="flex flex-col gap-2">
                                          <Input
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                            className="text-sm text-gray-700 border p-1 rounded w-full"
                                            autoFocus
                                          />
                                          <div className="flex justify-end gap-2">
                                            <Check
                                              size={16}
                                              className="cursor-pointer text-success hover:text-success/80"
                                              onClick={() => handleEditCard(card.id, list.id, editingText)}
                                            />
                                            <X
                                              size={16}
                                              className="cursor-pointer text-error hover:text-error/80"
                                              onClick={() => setEditingCardId(null)}
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex justify-between items-start">
                                          <div className="flex items-start gap-2">
                                            <div 
                                              className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border cursor-pointer
                                                ${card.completed 
                                                  ? "bg-success border-success" 
                                                  : "border-gray-400 hover:border-gray-600"}`}
                                              onClick={() => handleToggleCompleted(card.id, list.id)}
                                            >
                                              {card.completed && (
                                                <Check size={14} className="text-white" />
                                              )}
                                            </div>
                                            <p className={`text-sm ${card.completed 
                                              ? "text-gray-500 line-through" 
                                              : "text-gray-700"}`}>
                                              {card.text}
                                            </p>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <button
                                              className="p-1 rounded-full hover:bg-gray-100"
                                              onClick={() => {
                                                setEditingCardId(card.id);
                                                setEditingText(card.text);
                                              }}
                                            >
                                              <SquarePen size={14} className="text-gray-500" />
                                            </button>
                                            <button
                                              className="p-1 rounded-full hover:bg-gray-100"
                                              onClick={() => handleDeleteCard(card.id, list.id)}
                                            >
                                              <Trash2 size={14} className="text-gray-500" />
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            ) : (
                              <div className="text-center py-4 text-sm text-gray-500 italic bg-gray-50 rounded-md">
                                No cards yet
                              </div>
                            )}
                            {provided.placeholder}
                          </div>

                          {/* Add Card Button/Form */}
                          {showAddCardMap[list.id] ? (
                            <AddCards
                              list={list}
                              setShowAddCard={(show) => handleSetShowAddCard(list.id, show)}
                              setLists={setLists}
                            />
                          ) : (
                            <Button
                              onClick={() => handleAddCard(list.id)}
                              disabled={editingCardId !== null || editingListId !== null}
                              className={`w-full flex items-center justify-center gap-2 text-sm font-medium 
                                bg-transparent hover:bg-gray-200 text-gray-700 p-2 rounded-md border border-gray-200
                                ${(editingCardId !== null)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""}`}
                            >
                              <Plus size={16} /> Add a card
                            </Button>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ColumnList;
