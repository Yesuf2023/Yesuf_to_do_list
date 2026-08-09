/* =========================================
   TODO APP
========================================= */


// =========================================
// DATA
// =========================================

let tasks =
    JSON.parse(
        localStorage.getItem(
            "myTodoTasks"
        )
    ) || {};


let currentDate =
    new Date();


let selectedDate =
    new Date();


let draggedIndex = null;

let draggedDate = null;

let draggedElement = null;


// =========================================
// ELEMENTS
// =========================================

const calendar =
    document.getElementById(
        "calendar"
    );


const monthYear =
    document.getElementById(
        "monthYear"
    );


const selectedDateElement =
    document.getElementById(
        "selectedDate"
    );


const taskList =
    document.getElementById(
        "taskList"
    );


const taskCount =
    document.getElementById(
        "taskCount"
    );


const taskInput =
    document.getElementById(
        "taskInput"
    );


const addTaskButton =
    document.getElementById(
        "addTaskButton"
    );


const previousMonth =
    document.getElementById(
        "previousMonth"
    );


const nextMonth =
    document.getElementById(
        "nextMonth"
    );


const deleteCompletedButton =
    document.getElementById(
        "deleteCompleted"
    );


const todayButton =
    document.getElementById(
        "todayButton"
    );


const calendarButton =
    document.getElementById(
        "calendarButton"
    );


const taskButton =
    document.getElementById(
        "taskButton"
    );


// =========================================
// DATE KEY
// =========================================

function getDateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// =========================================
// DATE DISPLAY
// =========================================

function formatDate(date) {

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric"
        }
    );

}


// =========================================
// SAVE TASKS
// =========================================

function saveTasks() {

    localStorage.setItem(
        "myTodoTasks",
        JSON.stringify(tasks)
    );

}


// =========================================
// RENDER CALENDAR
// =========================================

function renderCalendar() {

    calendar.innerHTML = "";


    const year =
        currentDate.getFullYear();


    const month =
        currentDate.getMonth();


    monthYear.textContent =
        currentDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const previousMonthDays =
        new Date(
            year,
            month,
            0
        ).getDate();


    // Previous month

    for (
        let i = firstDay - 1;
        i >= 0;
        i--
    ) {

        const day =
            previousMonthDays - i;

        createCalendarDay(
            new Date(
                year,
                month - 1,
                day
            ),
            true
        );

    }


    // Current month

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        createCalendarDay(
            new Date(
                year,
                month,
                day
            ),
            false
        );

    }


    // Next month

    while (
        calendar.children.length < 42
    ) {

        const day =
            calendar.children.length -
            firstDay -
            daysInMonth +
            1;

        createCalendarDay(
            new Date(
                year,
                month + 1,
                day
            ),
            true
        );

    }

}


// =========================================
// CALENDAR DAY
// =========================================

function createCalendarDay(
    date,
    otherMonth
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "calendar-day";


    element.textContent =
        date.getDate();


    if (otherMonth) {

        element.classList.add(
            "other-month"
        );

    }


    // Today

    if (
        getDateKey(date) ===
        getDateKey(new Date())
    ) {

        element.classList.add(
            "today"
        );

    }


    // Selected date

    if (
        getDateKey(date) ===
        getDateKey(selectedDate)
    ) {

        element.classList.add(
            "selected"
        );

    }


    // Has tasks

    const key =
        getDateKey(date);


    if (
        tasks[key] &&
        tasks[key].length > 0
    ) {

        element.classList.add(
            "has-task"
        );

    }


    element.addEventListener(
        "click",
        function () {

            selectedDate =
                new Date(date);

            currentDate =
                new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    1
                );

            renderCalendar();

            renderTasks();

        }
    );


    calendar.appendChild(
        element
    );

}


// =========================================
// RENDER TASKS
// =========================================

function renderTasks() {

    const key =
        getDateKey(
            selectedDate
        );


    selectedDateElement.textContent =
        formatDate(
            selectedDate
        );


    taskList.innerHTML = "";


    const dayTasks =
        tasks[key] || [];


    taskCount.textContent =
        dayTasks.length;


    if (
        dayTasks.length === 0
    ) {

        taskList.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    📝
                </div>

                <p>
                    No tasks for this day
                </p>

            </div>

        `;

        return;

    }


    dayTasks.forEach(
        function (task, index) {

            createTask(
                task,
                index,
                key
            );

        }
    );

}


// =========================================
// CREATE TASK
// =========================================

function createTask(
    task,
    index,
    dateKey
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "task-item";


    element.draggable = true;


    element.dataset.index =
        index;


    if (task.completed) {

        element.classList.add(
            "completed"
        );

    }


    element.innerHTML = `

        <div class="drag-handle">
            ⋮⋮
        </div>

        <button
            class="check-button"
            type="button"
            aria-label="Complete task"
        ></button>

        <div class="task-text">
            ${escapeHTML(task.text)}
        </div>

        <button
            class="delete-button"
            type="button"
            aria-label="Delete task"
            title="Delete task"
        >
            🗑
        </button>

    `;


    // =====================================
    // COMPLETE TASK
    // =====================================

    const checkButton =
        element.querySelector(
            ".check-button"
        );


    checkButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            task.completed =
                !task.completed;


            saveTasks();

            renderTasks();

            renderCalendar();

        }
    );


    // =====================================
    // DELETE TASK
    // =====================================

    const deleteButton =
        element.querySelector(
            ".delete-button"
        );


    deleteButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            if (
                !task.completed
            ) {

                const confirmDelete =
                    confirm(
                        "This task is not completed. Delete it anyway?"
                    );


                if (!confirmDelete) {

                    return;

                }

            }


            tasks[dateKey].splice(
                index,
                1
            );


            if (
                tasks[dateKey].length === 0
            ) {

                delete tasks[dateKey];

            }


            saveTasks();

            renderTasks();

            renderCalendar();

        }
    );


    // =====================================
    // DRAG & DROP
    // =====================================

    setupDragAndDrop(
        element,
        index,
        dateKey
    );


    taskList.appendChild(
        element
    );

}


// =========================================
// DRAG & DROP
// =========================================

function setupDragAndDrop(
    element,
    index,
    date
) {


    // -------------------------------------
    // DESKTOP DRAG START
    // -------------------------------------

    element.addEventListener(
        "dragstart",
        function (event) {

            draggedIndex =
                index;

            draggedDate =
                date;

            draggedElement =
                element;


            element.classList.add(
                "dragging"
            );


            event.dataTransfer.effectAllowed =
                "move";


            event.dataTransfer.setData(
                "text/plain",
                String(index)
            );

        }
    );


    // -------------------------------------
    // DESKTOP DRAG END
    // -------------------------------------

    element.addEventListener(
        "dragend",
        function () {

            element.classList.remove(
                "dragging"
            );


            clearDragStyles();


            draggedIndex = null;

            draggedDate = null;

            draggedElement = null;

        }
    );


    // -------------------------------------
    // DESKTOP DRAG OVER
    // -------------------------------------

    element.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();


            if (
                draggedElement === element ||
                draggedIndex === null
            ) {

                return;

            }


            clearDragStyles();


            element.classList.add(
                "drag-over"
            );

        }
    );


    // -------------------------------------
    // DESKTOP DROP
    // -------------------------------------

    element.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();


            if (
                draggedIndex === null ||
                draggedElement === element
            ) {

                return;

            }


            const targetIndex =
                Number(
                    element.dataset.index
                );


            reorderTasks(
                draggedDate,
                draggedIndex,
                date,
                targetIndex
            );


            clearDragStyles();


            draggedIndex = null;

            draggedDate = null;

            draggedElement = null;

        }
    );


    // =====================================
    // IPHONE TOUCH DRAG
    // =====================================

    let touchStartY = 0;

    let touchDragging = false;


    element.addEventListener(
        "touchstart",
        function (event) {

            if (
                event.target.closest(
                    "button"
                )
            ) {

                return;

            }


            const touch =
                event.touches[0];


            touchStartY =
                touch.clientY;


            touchDragging = false;

        },
        {
            passive: true
        }
    );


    element.addEventListener(
        "touchmove",
        function (event) {

            if (
                event.target.closest(
                    "button"
                )
            ) {

                return;

            }


            const touch =
                event.touches[0];


            const distance =
                Math.abs(
                    touch.clientY -
                    touchStartY
                );


            if (
                distance > 8 &&
                !touchDragging
            ) {

                touchDragging = true;


                draggedIndex =
                    index;

                draggedDate =
                    date;

                draggedElement =
                    element;


                element.classList.add(
                    "dragging"
                );

            }


            if (
                !touchDragging
            ) {

                return;

            }


            event.preventDefault();


            const target =
                document.elementFromPoint(
                    touch.clientX,
                    touch.clientY
                );


            const targetTask =
                target?.closest(
                    ".task-item"
                );


            clearDragStyles();


            if (
                targetTask &&
                targetTask !== element
            ) {

                targetTask.classList.add(
                    "drag-over"
                );

            }

        },
        {
            passive: false
        }
    );


    // -------------------------------------
    // IPHONE TOUCH END
    // -------------------------------------

    element.addEventListener(
        "touchend",
        function (event) {

            if (
                !touchDragging
            ) {

                return;

            }


            const touch =
                event.changedTouches[0];


            const target =
                document.elementFromPoint(
                    touch.clientX,
                    touch.clientY
                );


            const targetTask =
                target?.closest(
                    ".task-item"
                );


            if (
                targetTask &&
                targetTask !== element
            ) {

                const targetIndex =
                    Number(
                        targetTask.dataset.index
                    );


                reorderTasks(
                    draggedDate,
                    draggedIndex,
                    date,
                    targetIndex
                );

            }


            element.classList.remove(
                "dragging"
            );


            clearDragStyles();


            draggedIndex = null;

            draggedDate = null;

            draggedElement = null;

            touchDragging = false;

        }
    );

}


// =========================================
// REORDER TASKS
// =========================================

function reorderTasks(
    oldDate,
    oldIndex,
    newDate,
    newIndex
) {

    if (
        !tasks[oldDate]
    ) {

        return;

    }


    const movedTask =
        tasks[oldDate].splice(
            oldIndex,
            1
        )[0];


    if (
        !movedTask
    ) {

        return;

    }


    if (
        !tasks[newDate]
    ) {

        tasks[newDate] = [];

    }


    if (
        oldDate === newDate &&
        oldIndex < newIndex
    ) {

        newIndex--;

    }


    tasks[newDate].splice(
        newIndex,
        0,
        movedTask
    );


    saveTasks();

    renderTasks();

    renderCalendar();

}


// =========================================
// CLEAR DRAG STYLES
// =========================================

function clearDragStyles() {

    document
        .querySelectorAll(
            ".drag-over"
        )
        .forEach(
            function (element) {

                element.classList.remove(
                    "drag-over"
                );

            }
        );

}


// =========================================
// ADD TASK
// =========================================

function addTask() {

    const text =
        taskInput.value.trim();


    if (!text) {

        taskInput.focus();

        return;

    }


    const key =
        getDateKey(
            selectedDate
        );


    if (
        !tasks[key]
    ) {

        tasks[key] = [];

    }


    tasks[key].push({

        id:
            Date.now(),

        text:
            text,

        completed:
            false

    });


    taskInput.value = "";


    saveTasks();

    renderTasks();

    renderCalendar();


    taskInput.focus();

}


// =========================================
// DELETE ALL COMPLETED TASKS
// =========================================

function deleteCompletedTasks() {

    const key =
        getDateKey(
            selectedDate
        );


    if (
        !tasks[key]
    ) {

        return;

    }


    const completedCount =
        tasks[key].filter(
            task => task.completed
        ).length;


    if (
        completedCount === 0
    ) {

        alert(
            "There are no completed tasks."
        );

        return;

    }


    const confirmDelete =
        confirm(
            `Delete ${completedCount} completed task(s)?`
        );


    if (
        !confirmDelete
    ) {

        return;

    }


    tasks[key] =
        tasks[key].filter(
            task => !task.completed
        );


    if (
        tasks[key].length === 0
    ) {

        delete tasks[key];

    }


    saveTasks();

    renderTasks();

    renderCalendar();

}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// =========================================
// EVENTS
// =========================================

addTaskButton.addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            addTask();

        }

    }
);


deleteCompletedButton.addEventListener(
    "click",
    deleteCompletedTasks
);


// =========================================
// MONTH NAVIGATION
// =========================================

previousMonth.addEventListener(
    "click",
    function () {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderCalendar();

    }
);


nextMonth.addEventListener(
    "click",
    function () {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderCalendar();

    }
);


// =========================================
// TODAY
// =========================================

todayButton.addEventListener(
    "click",
    function () {

        const today =
            new Date();


        selectedDate =
            new Date(today);


        currentDate =
            new Date(today);


        renderCalendar();

        renderTasks();

    }
);


// =========================================
// CALENDAR NAV
// =========================================

calendarButton.addEventListener(
    "click",
    function () {

        document
            .querySelector(
                ".calendar-card"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// =========================================
// TASK NAV
// =========================================

taskButton.addEventListener(
    "click",
    function () {

        document
            .querySelector(
                ".task-area"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// =========================================
// START APPLICATION
// =========================================

renderCalendar();

renderTasks();