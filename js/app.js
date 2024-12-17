// Get references to HTML elements
const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const filterButtons = document.querySelectorAll(".filter-todos");

// Load todos from local storage or initialize an empty array
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Function to save todos to local storage
const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Function to generate a unique ID for new todos
const generatedId = () => {
  return Date.now().toString();
};

// Function to display an alert message
const showAlert = (message, type) => {
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert", `alert-${type}`);
  alertMessage.appendChild(alert);
  // Remove alert after 2 seconds
  setTimeout(() => {
    alert.remove();
  }, 2000);
};

// Function to display the list of todos
const displayTodos = (data) => {
  const todoList = data || todos; // Use the passed data or the full todos array
  todosBody.innerHTML = ""; // Clear existing todos

  // If no todos, display a message
  if (!todoList.length) {
    todosBody.innerHTML = "<tr><td colspan='4'>هیچ عنوانی یافت نشد!</td></tr>";
    return;
  }

  // Loop through todos and construct table rows
  todoList.forEach((todo) => {
    const row = document.createElement("tr");
    row.innerHTML = `  
      <td>${todo.task}</td>  
      <td>${todo.date || "بدون تاریخ"}</td>  
      <td>${todo.completed ? "تکمیل شده" : "در حال انجام"}</td>  
      <td>  
        <button onclick="editHandler('${todo.id}')">ویرایش</button>  
        <button onclick="toggleHandler('${todo.id}')">${
      todo.completed ? "قبل" : "بعد"
    }</button>  
        <button onclick="deleteHandler('${todo.id}')">حذف</button>  
      </td>  
    `;
    todosBody.appendChild(row); // Append the row to the table
  });
};

// Function to add a new todo
const addHandler = () => {
  const task = taskInput.value; // Get task input
  const date = dateInput.value; // Get date input
  const todo = {
    id: generatedId(), // Generate unique ID
    completed: false, // Initial status is incomplete
    task,
    date,
  };

  // If the task is provided, add it to the todos
  if (task) {
    todos.push(todo);
    saveToLocalStorage(); // Save to local storage
    displayTodos(); // Refresh the displayed todo list
    taskInput.value = ""; // Clear input fields
    dateInput.value = "";
    showAlert("تودو با موفقیت اضافه شد", "success"); // Show success alert
  } else {
    showAlert("لطفا تودو را کامل وارد کنید!", "error"); // Show error alert
  }
};

// Function to delete all todos
const deleteAllHandler = () => {
  if (todos.length) {
    todos = []; // Clear todos array
    saveToLocalStorage(); // Update local storage
    displayTodos(); // Refresh the displayed todo list
    showAlert("همه تودوها حذف شد", "success"); // Show success alert
  } else {
    showAlert("هیچ تودویی برای حذف کردن وجود ندارد!", "error"); // Show error alert
  }
};

// Function to delete a specific todo by ID
const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id); // Filter out the deleted todo
  todos = newTodos; // Update todos list
  saveToLocalStorage(); // Update local storage
  displayTodos(); // Refresh the displayed todo list
  showAlert("تودو حذف شد", "success"); // Show success alert
};

// Function to toggle the completion status of a todo
const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id); // Find the todo by ID
  if (todo) {
    todo.completed = !todo.completed; // Flip completion status
    saveToLocalStorage(); // Update local storage
    displayTodos(); // Refresh the displayed todo list
    showAlert("وضعیت تودو تغییر کرد", "success"); // Show success alert
  }
};

// Function to prepare for editing a todo
const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id); // Find the todo by ID
  if (todo) {
    taskInput.value = todo.task; // Populate input with current task
    dateInput.value = todo.date; // Populate input with current date
    addButton.style.display = "none"; // Hide add button
    editButton.style.display = "inline-block"; // Show edit button
    editButton.dataset.id = id; // Store the ID on the edit button
  }
};

// Function to apply the edit to a todo
const applyEditHandler = (event) => {
  const id = event.target.dataset.id; // Get ID from edit button
  const todo = todos.find((todo) => todo.id === id); // Find the todo by ID
  if (todo) {
    todo.task = taskInput.value; // Update task
    todo.date = dateInput.value; // Update date
    taskInput.value = ""; // Clear input fields
    dateInput.value = "";
    addButton.style.display = "inline-block"; // Show add button
    editButton.style.display = "none"; // Hide edit button
    saveToLocalStorage(); // Update local storage
    displayTodos(); // Refresh the displayed todo list
    showAlert("تودو با موفقیت ویرایش شد", "success"); // Show success alert
  }
};

// Function to filter todos based on their completion status
const filterhandler = (event) => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter; // Get filter type from button dataset
  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => !todo.completed); // Show only pending todos
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed); // Show only completed todos
      break;
    default:
      filteredTodos = todos; // Show all todos
      break;
  }
  displayTodos(filteredTodos); // Refresh the display with the filtered list
};

// Add event listeners for necessary actions
window.addEventListener("load", () => displayTodos()); // Display todos on page load
addButton.addEventListener("click", addHandler); // Add todo on button click
deleteAllButton.addEventListener("click", deleteAllHandler); // Delete all todos on button click
editButton.addEventListener("click", applyEditHandler); // Apply edit on button click
filterButtons.forEach((button) => {
  button.addEventListener("click", filterhandler); // Filter todos on button click
});
