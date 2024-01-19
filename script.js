document.addEventListener('DOMContentLoaded', () => {
    loadGoals();
    addCurrentDates();
});

document.getElementById('goal-form').addEventListener('submit', function(e) {
    e.preventDefault();

    let newGoal = document.getElementById('new-goal').value.trim();
    let selectedDay = document.getElementById('day-select').value;

    if (newGoal) {
        addGoalToDay(newGoal, selectedDay);
        document.getElementById('new-goal').value = '';
        saveGoals();
    }
});

function addGoalToDay(goal, day) {
    let ul = document.getElementById(day).querySelector('ul');
    let li = createGoalElement(goal);
    ul.appendChild(li);
    saveGoals();
}

function createGoalElement(goalText) {
    let li = document.createElement('li');

    let textSpan = document.createElement('span');
    textSpan.className = 'goal-text';
    textSpan.textContent = goalText;
    li.appendChild(textSpan);

    let completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.className = 'complete-btn';
    completeButton.onclick = function() {
        li.classList.toggle('completed');
        saveGoals();
    };
    li.appendChild(completeButton);

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = function() {
        li.remove();
        saveGoals();
    };
    li.appendChild(deleteButton);

    return li;
}

function saveGoals() {
    let goals = {};
    document.querySelectorAll('.daily-goals').forEach(dayDiv => {
        let day = dayDiv.id;
        let dayGoals = [];
        dayDiv.querySelectorAll('li').forEach(li => {
            let goalText = li.childNodes[0].nodeValue.trim();
            dayGoals.push({ text: goalText, completed: li.classList.contains('completed') });
        });
        goals[day] = dayGoals;
    });
    localStorage.setItem('goals', JSON.stringify(goals));
}

function loadGoals() {
    let storedGoals = localStorage.getItem('goals');
    if (storedGoals) {
        let goals = JSON.parse(storedGoals);
        Object.keys(goals).forEach(day => {
            let dayGoals = goals[day];
            dayGoals.forEach(goalObj => {
                let li = createGoalElement(goalObj.text);
                if (goalObj.completed) {
                    li.classList.add('completed');
                }
                document.getElementById(day).querySelector('ul').appendChild(li);
            });
        });
    }
}

function addCurrentDates() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date();
    days.forEach(day => {
        let dayIndex = days.indexOf(day);
        let date = new Date(today);
        date.setDate(today.getDate() - today.getDay() + dayIndex);
        let dateString = date.toLocaleDateString();
        document.getElementById(day).querySelector('h3').textContent = `${capitalize(day)} - ${dateString}`;
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
