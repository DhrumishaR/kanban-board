import { useEffect, useState } from "react";
import ColumnList from "./ColumnList";
import AddColumn from "./AddColumn";
import { Toaster } from 'react-hot-toast';
import toast from "react-hot-toast";

export interface Card {
  id: string;
  text: string;
  completed: boolean;
};

export interface List {
  id: string;
  title: string;
  cards: Card[];
};

const KanBan = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedLists = localStorage.getItem("lists");
      if (storedLists) {
        setLists(JSON.parse(storedLists));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast.error("Failed to load your boards. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save lists to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("lists", JSON.stringify(lists));
    }
  }, [lists, isLoading]);

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Kanban Board</h1>
      </header>
      
      <AddColumn lists={lists} setLists={setLists} />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : lists.length === 0 ? (
        <div className="mt-10 text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Lists Yet</h2>
          <p className="text-gray-600 mb-4">Create your first list to get started with your kanban board.</p>
        </div>
      ) : (
        <ColumnList lists={lists} setLists={setLists} />
      )}
      
      <Toaster 
        position="top-center"
      />
    </div>
  );
};

export default KanBan;
