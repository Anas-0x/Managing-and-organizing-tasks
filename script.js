document.addEventListener('DOMContentLoaded', loadTasks);

let currentTargetColumn = null;
let selectedTaskIds = [];

function addTask() {
    const input = document.getElementById('task-input');
    const taskText = input.value.trim();
    if (!taskText) return;

    const taskId = 'task-' + Date.now();
    createTaskElement(taskText, taskId, 'todo');
    saveTasks();
    input.value = '';
}

function createTaskElement(text, id, status) {
    const task = document.createElement('div');
    task.className = 'task';
    task.id = id;
    
    task.innerHTML = `
        <span>${text}</span>
        <button class="delete-btn" onclick="deleteTask('${id}')">&times;</button>
    `;
    
    document.getElementById(status).appendChild(task);
}


function openSelection(targetColumn) {
    
    cancelSelection();
    
    currentTargetColumn = targetColumn;
    const allTasks = document.querySelectorAll('.task');
    let hasAvailableTasks = false;

    allTasks.forEach(task => {
        if (task.parentElement.id !== targetColumn) {
            task.classList.add('faded');
            task.onclick = () => toggleSelectTask(task.id);
            hasAvailableTasks = true;
        }
    });

    if (hasAvailableTasks) {
  
        document.getElementById(`confirm-${targetColumn}`).style.display = 'block';
    }
}

function toggleSelectTask(id) {
    const taskElement = document.getElementById(id);
    if (taskElement.classList.contains('selected')) {
        taskElement.classList.remove('selected');
        selectedTaskIds = selectedTaskIds.filter(taskId => taskId !== id);
    } else {
        taskElement.classList.add('selected');
        selectedTaskIds.push(id);
    }
}
function confirmMove(targetColumn) {
    selectedTaskIds.forEach(id => {
        const taskElement = document.getElementById(id);
        if (taskElement) {
            document.getElementById(targetColumn).appendChild(taskElement);
        }
    });

    cancelSelection();
    saveTasks(); 
}

function cancelSelection() {
    const allTasks = document.querySelectorAll('.task');
    allTasks.forEach(task => {
        task.classList.remove('faded', 'selected');
        task.onclick = null; 
    });

    document.getElementById('confirm-inprogress').style.display = 'none';
    document.getElementById('confirm-done').style.display = 'none';
    
    selectedTaskIds = [];
    currentTargetColumn = null;
}

function deleteTask(id) {
    selectedTaskIds = selectedTaskIds.filter(taskId => taskId !== id);
    document.getElementById(id).remove();
    saveTasks();
}
function saveTasks() {
    const statuses = ['todo', 'inprogress', 'done'];
    let boardData = {};

    statuses.forEach(status => {
        boardData[status] = [];
        const list = document.getElementById(status).children;
        for (let i = 0; i < list.length; i++) {
            boardData[status].push({
                id: list[i].id,
                text: list[i].querySelector('span').innerText
            });
        }
    });

    localStorage.setItem('kanbanBoardTasks', JSON.stringify(boardData));
}

function loadTasks() {
    const data = localStorage.getItem('kanbanBoardTasks');
    if (!data) return;

    const boardData = JSON.parse(data);
    for (const status in boardData) {
        boardData[status].forEach(task => {
            createTaskElement(task.text, task.id, status);
        });
    }
}
