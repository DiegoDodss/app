document.addEventListener('DOMContentLoaded', loadGoals);
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
    return li;
}

function saveGoals() {
    let goals = {};
    document.querySelectorAll('.daily-goals').forEach(dayDiv => {
        let day = dayDiv.id;
        let dayGoals = [];
        dayDiv.querySelectorAll('li').forEach(li => {
            dayGoals.push({ text: li.querySelector('span').textContent, completed: li.classList.contains('completed') });
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
