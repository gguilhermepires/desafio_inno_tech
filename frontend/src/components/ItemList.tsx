import React, { useEffect, useState } from 'react';
import itemService, { Item, CreateItemDto, UpdateItemDto } from '../services/itemService';
import { io, Socket } from 'socket.io-client'; // Import io and Socket type

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState<string>('qaaa');
  const [newItemDescription, setNewItemDescription] = useState<string>('aa');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [updatedItemName, setUpdatedItemName] = useState<string>('');
  const [updatedItemDescription, setUpdatedItemDescription] = useState<string>('aaa');
  const [socket, setSocket] = useState<Socket | null>(null); // Change ws to socket and type to Socket

  useEffect(() => {
    fetchItems(); // Initial fetch of items via REST

    // Establish Socket.IO connection
    const newSocket = io('http://localhost:3000'); // Use io() for Socket.IO

    newSocket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    newSocket.on('ITEM_CREATED', (payload: Item) => {
      console.log('Received ITEM_CREATED:', payload);
      setItems((prevItems) => [...prevItems, payload]);
    });

    newSocket.on('ITEM_UPDATED', (payload: Item) => {
      console.log('Received ITEM_UPDATED:', payload);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === payload.id ? payload : item
        )
      );
    });

    newSocket.on('ITEM_DELETED', (payload: { id: string }) => {
      console.log('Received ITEM_DELETED:', payload);
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== payload.id)
      );
    });

    newSocket.on('ITEMS_INITIAL_LOAD', (payload: Item[]) => {
      console.log('Received ITEMS_INITIAL_LOAD:', payload);
      setItems(payload);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    setSocket(newSocket); // Store the Socket.IO instance in state

    // Cleanup function to close Socket.IO connection when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const fetchItems = async () => {
    try {
      const data = await itemService.getAllItems();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleCreateItem = () => {
    if (!newItemDescription) { // Apenas verifica a descrição, já que o nome será padrão
      alert('Description cannot be empty.');
      return;
    }
    if (socket && socket.connected) {
      const newItem: CreateItemDto = {
        name: 'User Message', // Define um nome padrão para o item
        description: newItemDescription
      };
      socket.emit('CREATE_ITEM', newItem);
      setNewItemName(''); // Pode manter ou remover, já que não é usado no input
      setNewItemDescription('');
    } else {
      console.error('Socket.IO is not connected.');
      alert('Socket.IO is not connected. Please try again later.');
    }
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setUpdatedItemName(item.name);
    setUpdatedItemDescription(item.description);
  };

  const handleUpdateItem = () => { // Removed async
    if (!editingItem || (!updatedItemName && !updatedItemDescription)) {
      alert('No changes to update or no item selected.');
      return;
    }
    if (socket && socket.connected) {
      const updatedData: UpdateItemDto = {};
      if (updatedItemName !== editingItem.name) {
        updatedData.name = updatedItemName;
      }
      if (updatedItemDescription !== editingItem.description) {
        updatedData.description = updatedItemDescription;
      }

      socket.emit('UPDATE_ITEM', { id: editingItem.id, data: updatedData }); // Use socket.emit with payload structure
      setEditingItem(null);
      setUpdatedItemName('');
      setUpdatedItemDescription('');
    } else {
      console.error('Socket.IO is not connected.');
      alert('Socket.IO is not connected. Please try again later.');
    }
  };

  const handleDeleteItem = (id: string) => { // Removed async
    if (socket && socket.connected) {
      socket.emit('DELETE_ITEM', { id }); // Use socket.emit
    } else {
      console.error('Socket.IO is not connected.');
      alert('Socket.IO is not connected. Please try again later.');
    }
  };

  return (
    <>
      {/* Formulário de edição (aparece acima da lista quando um item é selecionado para edição) */}
      {editingItem && (
        <div className="edit-form">
          <h2>Edit Item</h2>
          <div>
            <input
              type="text"
              placeholder="Updated Name"
              value={updatedItemName}
              onChange={(e) => setUpdatedItemName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Updated Description"
              value={updatedItemDescription}
              onChange={(e) => setUpdatedItemDescription(e.target.value)}
            />
            <button onClick={handleUpdateItem}>Save Changes</button>
            <button onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Lista de Itens (simulando as mensagens do chat) */}
      <div className="items-container">
        {items.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#8e8e8e' }}>No items yet. Add one below!</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="item-actions">
                <button onClick={() => handleEditClick(item)}>Edit</button>
                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Área de entrada para criar novos itens (fixa na parte inferior) */}
      <div className="input-area">
        <div className="input-area-content">
          <input
            type="text"
            placeholder="Ask something"
            value={newItemDescription}
            onChange={(e) => setNewItemDescription(e.target.value)}
          />
          <button onClick={handleCreateItem}>Send</button>
        </div>
      </div>
    </>
  );
};

export default ItemList;