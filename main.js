const app = document.querySelector('#app');

app.innerHTML = `
    <div class="todos">
        <div class="todos-header">
            <h3 class="todos-title">TO-DO LIST</h3>
            <div>
                <p>You have ( <span class="todos-count"></span> ) tasks to do. </p>
                <button type="button" class="todos-clear" style="display:none;" >Delete selected one(s)</button>
            </div>
        </div>
        <form class="todos-form" name="todos">
            <input type="text" placeholder="What's today...?" name="todo">
            <small>Write something!</small>
        </form>
        <ul class="todos-list">
        </ul>
    </div>
`;


const saveInLocalStorage = (todos) => { //primer paso del local storage
    localStorage.setItem("todos", JSON.stringify(todos));
}

//---------------SELECTORES------------------------------
const root = document.querySelector('.todos');
const list = root.querySelector('.todos-list');
const clear = root.querySelector('.todos-clear');
const count = root.querySelector('.todos-count');
const form = document.forms.todos;
const input = form.elements.todo;

let state = JSON.parse(localStorage.getItem('todos')) || []; //es donde van a ir las listas
                    //tercer paso del local storage
                    //antes de renderizar el localstorage estaba asi:
                   //let state = []
//-----------HANDLERS VIEW----------------------------
const renderTodos = (todos) => { //inicio:
    let listString = "";
    todos.forEach((todo, index) => {
        listString += `
            <li data-id="${index}"${todo.complete? ' class="todos-complete"' : ""}>
                <input type="checkbox"${todo.complete? ' checked' : ""}>
                <span>${todo.label}</span>
                <button type="button"></button>
            </li>
        `
    });
    list.innerHTML = listString; 
    //fin: con esto, se crean las Task , dentro de un li

    //renderizar el delete all
    clear.style.display = todos.filter((todo)=>todo.complete).length 
    ? "block"
    : "none";

    //tasks counter
    count.innerText = todos.filter((todo) => !todo.complete).length;

}


//--------------------HANDLERS-------------------------------------------------
//Handlers: addToDo________
const addToDo = (e) => {
    e.preventDefault(); //evita que la pagina se recarge al hacer submit
    const label = input.value.trim(); //trim elimina espacios en blanco del pcipio y final
    const complete = false;

    if (label.length===0) { //si el  input esta vacio, mensaje de error
        form.classList.add('error')
        return; //no sigue ejecutando si length=0
    }
    form.classList.remove('error'); //sino, el error desaparece, length no es igual a 0

    state = [            //el letstate va a tener:
        ...state,        //lo que contenga el state
        {                //y en un objeto
            label,       //lo que contenga el label y el complete
            complete,
        },
    ];
    input.value = "";// cuando doy enter, se borra lo que sea que se haya puesto   
    console.log(state);
    renderTodos(state);
    saveInLocalStorage(state); //segundo paso del localstorage

    
};

//handlers: update ToDo
const updateTodo = ({target}) => {
    //obtenemos el data-id atribute:
    const id = parseInt(target.parentNode.dataset.id);
    //asignar el valor booleano (t/f) al complete:
    const complete = target.checked;

    state = state.map((todo, index) => {
        if (index === id) {
            return{
                ...todo,
                complete,
            };
        }
        return todo;
    });

    console.log(state);
    renderTodos(state);
    saveInLocalStorage(state); //segundo paso del local storage
};

//handler deleteTodo:
const deleteTodo = ({target}) => {
    if (target.nodeName.toLowerCase() !== "button") {
        return;
    }
    const id = parseInt(target.parentNode.dataset.id);
    const label = target.previousElementSibling.innerText;
    if (window.confirm(`Are you sure to delete "${label}"?`)) {
        state= state.filter((todo, index) => index !== id)
        renderTodos(state);
        saveInLocalStorage(state);//segundo paso del local storage
    }
};

//handler clear complete delete all
const clearComplete = () => {
    const todoCompletes = state.filter((todo) => todo.complete).length;
    if (todoCompletes === 0) {
        return;
    }
    if (window.confirm(`Are you sure to delete all of this (${todoCompletes}) tasks?`)) {
        state = state.filter((todo) => !todo.complete);
        renderTodos(state);
        saveInLocalStorage(state);//segundo paso del localstorage
        
    }
};



//---------ENTRY POINT---- PUNTO DE ENTRADA DE LA APP----- INICIALIZADOR---------
function init() {
    renderTodos(state);//si es un el state tiene algo, renderizarlo. ultimo paso del local storage
    form.addEventListener('submit', addToDo) //--> submit, cuando se envia el form
    list.addEventListener('change', updateTodo);
    list.addEventListener('click', deleteTodo);
    clear.addEventListener('click', clearComplete);
}


//--------------RUN THE APP---------------------------------
init();