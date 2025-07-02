/*
Create the HTML structure: input, button, and list.
Set up an array in JavaScript to store tasks.
Select DOM elements (input, button, list) in your script.
add an event listener to the button to:
Prevent default behavior.
Check for empty input.
Add the task to the array.
Clear the input field.
Re-render the list.
In the render function, loop through the array and create a new <li> for each task.
Add "Edit" and "Delete" buttons for each task (optional).
Save and load tasks from localStorage for persistence.
Add filtering options (optional).
Style the app with CSS.*/

/*Start of Scripts */
//Array to hold list values
let listArr = [];

//DOM elements:
const input = document.getElementById("input");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");

//on loading, look at the local storage and render the stored data:
window.addEventListener("load", (event) => {
  event.preventDefault();

  //on loading, retrive local storage data, convert it to an array and update the array above.
  //if local storage has no data, the array above remains an empty array.
  const getStoredData = localStorage.getItem("toDoList");
  const convertedData = JSON.parse(getStoredData);
  if (Array.isArray(convertedData)) {
    listArr = convertedData;
  }
  createRender();
});

//button event listener
addBtn.addEventListener("click", (event) => {
  event.preventDefault();

  if (input.value === "") {
    alert("enter a list item");
  } else {
    listArr.push(input.value.trim()); //adds the input to the array + trims whitespace
    //store data to local storage:
    saveToStorage();
  }
  input.value = ""; //clears the input field
  createRender(); //calls the function, making the list item
});

//disable add button if input is empty.
addBtn.disabled = !input.value.trim(); // Initial state
input.addEventListener("input", () => {
  addBtn.disabled = !input.value.trim();
});

//Event added on the input to allow pressing enter to add to the list.
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && input.value.trim()) {
    addBtn.click();
  }
});

function createRender() {
  list.innerHTML = ""; //The list must be cleared before each render to avoid duplicates.

  //get the data from local storage, convert it back to an array and then iterate over that array.
  const dataFromStorage = localStorage.getItem("toDoList");
  const arrayFromStorage = JSON.parse(dataFromStorage);

  listArr.forEach((element, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<div class="data"><input type="checkbox"/><span class="listItem">${element}</span></div><div class="btns"><button class="edit">edit</button><button class="remove">x</button></div>`;
    list.appendChild(listItem);

    const [editBtn, deleteBtn] = listItem.querySelectorAll("button");

    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      listArr.splice(index, 1);
      saveToStorage();
      createRender();
    });

    editBtn.addEventListener("click", (e) => {
      e.preventDefault();

      listItem.innerHTML = ""; //removes the already stored list item
      const editField = document.createElement("input");
      editField.value = element;
      editField.type = "text";
      editField.className = "editInput"
      editField.autofocus = true;

      const editFieldBtn = document.createElement("button");
      editFieldBtn.innerText = "done";
      editFieldBtn.className = "editBtnSbmt"

      listItem.appendChild(editField);
      listItem.appendChild(editFieldBtn);

      editFieldBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const editedVal = editField.value.trim();

        if (editedVal === "") {
          alert("Please enter updated value");
        } else {
          listArr.splice(index, 1, editedVal);
          saveToStorage();
        }

        createRender();
      });

      editField.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && editField.value.trim()) {
          editFieldBtn.click();
        }
      });

      editFieldBtn.disabled = !editField.value.trim(); // Initial state
      editField.addEventListener("input", () => {
        editFieldBtn.disabled = !editField.value.trim();
      });
    });
  });
}

function saveToStorage() {
  //store data to local storage:
  const stringedArr = JSON.stringify(listArr); //convert the array to a string
  localStorage.setItem("toDoList", stringedArr); //store the string version of the array, attached to the 'toDoList' key
}
