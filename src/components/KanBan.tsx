import { useState } from "react";
import ColumnList from "./ColumnList";
import AddColumn from "./AddColumn";
import { Toaster } from 'react-hot-toast';

export interface Card {
  id: string;
  text: string;
  completed:boolean;
};

export interface List {
  id: string;
  title: string;
  cards: Card[];
};

const KanBan = () => {
  const [lists, setLists] = useState<List[]>([]);
  return (
    <>
      <AddColumn lists={lists} setLists={setLists} />
      <ColumnList lists={lists} setLists={setLists} />
      <Toaster position="top-right"/>
    </>
  );
};

export default KanBan;
