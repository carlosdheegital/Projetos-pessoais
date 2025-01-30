document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const taskList = document.getElementById('taskList');
    const progressBar = document.getElementById('progressBar');
    const congratsMessage = document.getElementById('congratsMessage');
    const newGoalForm = document.getElementById('newGoalForm');
    const newGoalInput = document.getElementById('newGoalInput');
    const filterAll = document.getElementById('filterAll');
    const filterCompleted = document.getElementById('filterCompleted');
    const filterPending = document.getElementById('filterPending');
    const themeToggle = document.getElementById('themeToggle');
    const exportTasks = document.getElementById('exportTasks');
    const importFile = document.getElementById('importFile');
    const importTasks = document.getElementById('importTasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Função para salvar tarefas no localStorage
    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função para renderizar tarefas
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
            return true;
        });

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            const taskDetails = document.createElement('div');
            taskDetails.className = 'task-details';
            taskDetails.innerHTML = `
                <span>${task.text}</span>
                <span class="task-due-date">Prazo: ${task.dueDate}</span>
            `;
            li.appendChild(taskDetails);
            li.classList.add(`priority-${task.priority}`);
            if (task.completed) {
                li.classList.add('completed');
            }
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(index);
            });
            li.appendChild(deleteButton);
            li.addEventListener('click', () => toggleComplete(index));
            taskList.appendChild(li);
        });
        updateProgress();
    }

    // Função para adicionar tarefa
    function addTask(text, priority, dueDate) { //addTask serve para adicionar a tarefa ao Array, Salvar a lista atualizada e Atualiza a interface para mostrar as mudanças
        tasks.push({ text, priority, dueDate, completed: false }); //dueDate é um parametro para mostrar a data
        updateLocalStorage();
        renderTasks();
    }

    // Função para excluir tarefa
    function deleteTask(index) {
        tasks.splice(index, 1);
        updateLocalStorage();
        renderTasks();
    }

    // Função para alternar conclusão da tarefa
    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        updateLocalStorage();
        renderTasks();
    }

    // Função para atualizar a barra de progresso
    function updateProgress() {
        const completedTasks = tasks.filter(task => task.completed).length;
        const totalTasks = tasks.length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progressBar.style.width = `${progress}%`;
        if (progress === 100) {
            congratsMessage.classList.remove('hidden');
        } else {
            congratsMessage.classList.add('hidden');
        }
    }

    // Evento para adicionar tarefa
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        const priority = priorityInput.value;
        const dueDate = dueDateInput.value;
        if (text !== '' && dueDate !== '') {
            addTask(text, priority, dueDate);
            taskInput.value = '';
            dueDateInput.value = '';
        }
    });

    // Evento para filtrar tarefas
    filterAll.addEventListener('click', () => renderTasks('all'));
    filterCompleted.addEventListener('click', () => renderTasks('completed'));
    filterPending.addEventListener('click', () => renderTasks('pending'));

    // Evento para alternar tema
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });

    // Evento para exportar tarefas
    exportTasks.addEventListener('click', () => {
        const dataStr = JSON.stringify(tasks);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tarefas.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Evento para importar tarefas
    importTasks.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            tasks = JSON.parse(event.target.result);
            updateLocalStorage();
            renderTasks();
        };
        reader.readAsText(file);
    });

    // Renderizar tarefas ao carregar a página
    renderTasks();
});
