import { Card, List } from "./KanBan";
import { Trash2, Plus, SquarePen, Check, CheckCircle } from "lucide-react";
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
import { parse } from "uuid";
import { useState } from "react";

export interface ColumnListProps {
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
}

const ColumnList: React.FC<ColumnListProps> = ({ lists, setLists }) => {
  const [showAddCardMap, setShowAddCardMap] = useState<Record<string, boolean>>(
    {}
  );
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const handleSetShowAddCard = (listId: string, show: boolean) => {
    setShowAddCardMap((prev) => ({
      ...prev,
      [listId]: show,
    }));
  };

  const handleAddCard = (listId: string) => {
    handleSetShowAddCard(listId, true);
  };

  const handleDeleteCard = (cardId: string, listId: string) => {
    const getList = localStorage.getItem("lists");
    const parsedList = JSON.parse(getList || "[]");

    const findListIndex = parsedList.findIndex((l: List) => l.id === listId);
    const findCardIndex = parsedList[findListIndex].cards.findIndex(
      (c: List) => c.id === cardId
    );

    parsedList[findListIndex].cards.splice(findCardIndex, 1);

    localStorage.setItem("lists", JSON.stringify([...parsedList]));
    setLists(parsedList);
  };

  const handleDeleteColumn = (listId: string) => {
    const getList = localStorage.getItem("lists");
    const parsedList = JSON.parse(getList || "[]");

    const findListIndex = parsedList.findIndex((l: List) => l.id === listId);
    parsedList[findListIndex].cards.length > 0
      ? toast.error("List is not empty, please delete all cards first")
      : parsedList.splice(findListIndex, 1);

    localStorage.setItem("lists", JSON.stringify([...parsedList]));
    setLists(parsedList);
  };

  const handleEditCard = (cardId: string, listId: string, newText: string) => {
    const getList = localStorage.getItem("lists");
    const parsedList = JSON.parse(getList || "[]");

    const findListIndex = parsedList.findIndex((l: List) => l.id === listId);
    const findCardIndex = parsedList[findListIndex].cards.findIndex(
      (c: List) => c.id === cardId
    );

    parsedList[findListIndex].cards[findCardIndex].text = newText;

    localStorage.setItem("lists", JSON.stringify([...parsedList]));
    setLists(parsedList);
    setEditingCardId(null);
    setEditingText("");
  };

  const handleToggleCompleted = (cardId: string, listId: string) => {
    const getList = localStorage.getItem("lists");
    const parsedList = JSON.parse(getList || "[]");

    const findListIndex = parsedList.findIndex((l: List) => l.id === listId);
    const findCardIndex = parsedList[findListIndex].cards.findIndex(
      (c: List) => c.id === cardId
    );

    parsedList[findListIndex].cards[findCardIndex].completed =
      !parsedList[findListIndex].cards[findCardIndex].completed;

    localStorage.setItem("lists", JSON.stringify([...parsedList]));
    setLists(parsedList);
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    const getList = localStorage.getItem("lists");
    const parsedList = JSON.parse(getList || "[]");

    if (type === "column") {
      const [movedList] = parsedList.splice(source.index, 1);
      parsedList.splice(destination.index, 0, movedList);
      setLists(parsedList);
      localStorage.setItem("lists", JSON.stringify(parsedList));
    } else {
      const sourceListIndex = parsedList.findIndex(
        (l: List) => l.id === source.droppableId
      );
      const destinationListIndex = parsedList.findIndex(
        (l: List) => l.id === destination.droppableId
      );

      const sourceList = parsedList[sourceListIndex];
      const destinationList = parsedList[destinationListIndex];

      if (sourceList === destinationList) {
        const sourcecard = sourceList.cards[source.index];
        sourceList.cards.splice(source.index, 1);
        sourceList.cards.splice(destination.index, 0, sourcecard);
        setLists(parsedList);
        localStorage.setItem("lists", JSON.stringify(parsedList));
      } else {
        const sourceCard = sourceList.cards[source.index];
        sourceList.cards.splice(source.index, 1);
        destinationList.cards.splice(destination.index, 0, sourceCard);
        setLists(parsedList);
        localStorage.setItem("lists", JSON.stringify(parsedList));
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="all-lists" direction="horizontal" type="column">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-6 mt-6 px-4 pb-4 w-full"
          >
            {lists.map((list, index) => (
                    <Draggable
                      draggableId={list.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          key={list.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-100 rounded-xl w-64 p-4 flex-shrink-0 shadow-md h-auto"
                        >
                          <Droppable droppableId={list.id} type="card">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col gap-2 min-h-[40px]"
                  >
                          {/* Header */}
                          <div className="flex items-center justify-between mb-3">
                            <h2 className="text-md font-semibold text-gray-800">
                              {list.title}
                            </h2>
                            <Trash2
                              onClick={() => handleDeleteColumn(list.id)}
                              size={15}
                              className="cursor-pointer"
                            />
                          </div>

                          {/* Cards */}
                          <div className="flex flex-col gap-2">
                            {list.cards.length?(
                              (list.cards.map((card, index) => (
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
                                      className={`flex justify-between items-center bg-white rounded-md p-2 w-full ${
                                        card.completed ? "line-through" : ""
                                      }`}
                                    >
                                      <div
                                        key={card.id}
                                        className={`flex justify-between items-center bg-white rounded-md p-2 w-full ${
                                          card.completed ? "line-through" : ""
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div className="relative group">
                                            <Input
                                              type="radio"
                                              checked={card.completed}
                                              className={`w-4 h-4 rounded-full border-2 transition z-0 duration-200 cursor-pointer
      ${card.completed ? "bg-black border-black" : "bg-white border-gray-400"}
    `}
                                              onClick={() =>
                                                handleToggleCompleted(
                                                  card.id,
                                                  list.id
                                                )
                                              }
                                            />
                                            <span className="absolute text-xs top-full left-1/2 mt-1 px-2 py-1 rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                              {card.completed
                                                ? "Mark Incompleted"
                                                : "Mark Completed"}
                                            </span>
                                          </div>

                                          {editingCardId === card.id ? (
                                            <Input
                                              value={editingText}
                                              onChange={(e) =>
                                                setEditingText(e.target.value)
                                              }
                                              className="text-sm text-gray-600 border p-1 rounded w-full mr-2"
                                            />
                                          ) : (
                                            <p className="text-sm text-gray-600">
                                              {card.text}
                                            </p>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {editingCardId === card.id ? (
                                            <Check
                                              size={15}
                                              className="cursor-pointer text-green-600"
                                              onClick={() =>
                                                handleEditCard(
                                                  card.id,
                                                  list.id,
                                                  editingText
                                                )
                                              }
                                            />
                                          ) : (
                                            <SquarePen
                                              size={15}
                                              onClick={() => {
                                                setEditingCardId(card.id);
                                                setEditingText(card.text);
                                              }}
                                              className="cursor-pointer"
                                            />
                                          )}
                                          {card.completed && (
                                            <Trash2
                                              size={15}
                                              onClick={() =>
                                                handleDeleteCard(
                                                  card.id,
                                                  list.id
                                                )
                                              }
                                              className="cursor-pointer"
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              )))):"NO Cards"}
                          </div>

                          {showAddCardMap[list.id] ? (
                            <div className="pt-2">
                              <AddCards
                                list={list}
                                setShowAddCard={() =>
                                  handleSetShowAddCard(list.id, false)
                                }
                                setLists={setLists}
                              />
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleAddCard(list.id)}
                              disabled={editingCardId !== null}
                              className={`w-full flex items-center justify-start gap-2 text-sm font-semibold mt-2 hover:bg-gray-200 p-2 rounded-md
              ${
                editingCardId !== null
                  ? "opacity-50 cursor-not-allowed"
                  : "text-[#44546F]"
              }`}
                            >
                              <Plus size={16} /> Add a card
                            </Button>
                          )}
                    {provided.placeholder}
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
