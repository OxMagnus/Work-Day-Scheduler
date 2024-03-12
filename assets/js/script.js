// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const card = $("<div>").addClass("card task-card mb-3");
  const cardBody = $("<div>").addClass("card-body");
  const title = $("<h5>").addClass("card-title").text(task.title);
  const description = $("<p>").addClass("card-text").text(task.description);
  const dueDate = $("<p>").addClass("card-text").text("Due Date: " + task.dueDate);
  const deleteButton = $("<button>")
    .addClass("btn btn-danger btn-sm float-end")
    .text("Delete")
    .click(handleDeleteTask.bind(null, task.id));

  card.append(cardBody.append(title, description, dueDate, deleteButton));

  return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  $("#todo-cards, #in-progress-cards, #done-cards").empty();

  taskList.forEach((task) => {
    const card = createTaskCard(task);
    $(`#${task.status}-cards`).append(card);
  });

  makeCardsDraggable();
  
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const title = $("#taskTitle").val();
  const description = $("#taskDescription").val();
  const dueDate = $("#datepicker").val();

  if (title && description && dueDate) {
    const newTask = {
      id: generateTaskId(),
      title,
      description,
      dueDate,
      status: "todo",
    };

    taskList.push(newTask);
    saveToLocalStorage();
    renderTaskList();
    $("#formModal").modal("hide");
  }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskId) {
  taskList = taskList.filter((task) => task.id !== taskId);
  saveToLocalStorage();
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.data("task-id");
  const newStatus = event.target.id;

  const updatedTaskList = taskList.map((task) =>
    task.id === taskId ? { ...task, status: newStatus } : task
  );

  taskList = updatedTaskList;
  saveToLocalStorage();
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
  
    $("#taskForm").submit(handleAddTask);
  
    
  
    $('#datepicker').datepicker({
      changeMonth: true,
      changeYear: true
    });

    $("#formModal .modal-body").sortable({
        connectWith: ".modal-body",
        tolerance: "pointer",
        handle: ".card-header",
        forcePlaceholderSize: true,
        helper: "clone",
        zIndex: 1000,
        stop: function (event, ui) {
          // Handle the drop event here if needed
        },
      });
    })
    
  
    // Make the form modal draggable and sortable
    $("#formModal").draggable({
      handle: ".modal-header",
      // Remove containment to allow dragging anywhere on the page
    });
  
   
    // Make the form modal draggable on modal show
    $("#formModal").on("show.bs.modal", function () {
      makeFormDraggable();
    });
   
  
  // Helper function to make task cards draggable
  function makeCardsDraggable() {
    $( ".task-card" ).draggable();
    $( ".swim-lanes" ).sortable();
     }; 
      
    
  
  
  
// Helper function to save tasks and nextId to localStorage
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));
}


