document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
});

function loadTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            data.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.task_name;

                // Add a checkbox to mark task as completed
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed;
                checkbox.addEventListener('change', () => markTaskCompleted(task.id, checkbox.checked));

                li.appendChild(checkbox);
                taskList.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskName = taskInput.value.trim();

    if (taskName !== '') {
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task_name: taskName }),
        })
            .then(response => response.json())
            .then(data => {
                taskInput.value = '';
                loadTasks();
            })
            .catch(error => console.error('Error:', error));
    }
}

function markTaskCompleted(taskId, completed) {
    fetch(`/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
    })
        .then(response => response.json())
        .then(data => {
            loadTasks(); // Reload tasks after marking as completed
        })
        .catch(error => console.error('Error:', error));
}
