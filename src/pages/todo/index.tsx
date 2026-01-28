import React, { useEffect, useState } from "react";

interface Todo {
  id: number;
  text: string;
}

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // 🔹 Load từ localStorage khi mở trang
  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  // 🔹 Lưu vào localStorage mỗi khi todos đổi
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddOrUpdate = () => {
    if (!input.trim()) return;

    if (editId !== null) {
      // ✏️ Update
      setTodos((prev) =>
        prev.map((t) => (t.id === editId ? { ...t, text: input } : t))
      );
      setEditId(null);
    } else {
      // ➕ Add
      setTodos((prev) => [...prev, { id: Date.now(), text: input }]);
    }

    setInput("");
  };

  const handleDelete = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEdit = (todo: Todo) => {
    setInput(todo.text);
    setEditId(todo.id);
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", textAlign: "center" }}>
      <h1>📝 Todo List</h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập công việc..."
        style={{ padding: 8, width: "70%" }}
      />
      <button onClick={handleAddOrUpdate} style={{ marginLeft: 10 }}>
        {editId !== null ? "Cập nhật" : "Thêm"}
      </button>

      <ul style={{ marginTop: 30, textAlign: "left" }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: 10 }}>
            {todo.text}
            <button
              onClick={() => handleEdit(todo)}
              style={{ marginLeft: 10 }}
            >
              Sửa
            </button>
            <button
              onClick={() => handleDelete(todo.id)}
              style={{ marginLeft: 5 }}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;
