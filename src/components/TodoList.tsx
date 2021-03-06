import * as React from "react";
import TodoListHeader from "./TodoListHeader";
import TodoListTasks from "./TodoListTasks";
import AddTaskForm from "./AddTaskForm";
import AddButton from "./AddButton";
import {ActionsTypes, ITask, ITaskUpdate} from "../types/ActionTypes";
import {connect} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {addTaskTC, changeListTitleTC, changeTaskTC, deleteTaskTC} from "../redux/reducer";

const s = require("./TodoList.module.css");

interface IProps {
    title: string;
    id: string;
    tasks: ITask[];
    closeList: () => void;
}

interface IState {
    addForm: boolean;
    currentTask: null | ITask;
}

interface IMDTP {
    addTask: (listId: string, title: string, description: string) => void
    changeTask: (listId: string, taskId: string, obj: ITaskUpdate) => void
    deleteTask: (listId: string, taskId: string) => void
    changeListTitle: (listId: string, title: string) => void
}

class TodoList extends React.Component<IProps & IMDTP, IState> {
    state: IState = {
        addForm: false,
        currentTask: null
    };
    activeAddForm = () => {
        this.setState({addForm: true})
    };
    deActiveAddForm = () => {
        this.setState({addForm: false, currentTask: null})
    };
    addTask = (title: string, description: string) => {
        this.props.addTask(this.props.id, title, description)
    };

    changeTask = (taskId: string, obj: ITaskUpdate) => {
        this.props.changeTask(this.props.id, taskId, obj);
        this.setState({currentTask: null})
    };
    changeListTitle = (title: string) => {
        this.props.changeListTitle(this.props.id, title)
    };

    doubleClick = (task: ITask) => {
        this.setState({currentTask: task, addForm: true})
    };
    deleteTask = (taskId: string) => {
        this.props.deleteTask(this.props.id, taskId)
    };

    render() {
        let tasksCount = this.props.tasks.length;

        let addTaskForm = <AddTaskForm currentTask={this.state.currentTask} addTask={this.addTask}
                                       deActiveAddForm={this.deActiveAddForm} changeTask={this.changeTask}/>;
        let tasksForm =
            <>
                <TodoListTasks changeTask={this.changeTask}
                               doubleClick={this.doubleClick}
                               deleteTask={this.deleteTask}
                               tasks={this.props.tasks}/>
                <AddButton addItem={this.activeAddForm}/>
            </>;

        return (
            <div className={s.todoListWrapper}>
                <TodoListHeader addForm={this.state.addForm} title={this.props.title}
                                changeTitle={this.changeListTitle} tasksCount={tasksCount}
                                closeList={this.props.closeList}/>
                {
                    !this.state.addForm ? tasksForm : addTaskForm
                }
            </div>
        )
    }
}

let mdtp = (dispatch: ThunkDispatch<any, any, ActionsTypes>): IMDTP => {
    return {
        addTask: (todolistId: string, title: string, description: string) => {
            let thunk = addTaskTC({todolistId, title, description});
            dispatch(thunk)
        },
        changeTask: (listId: string, taskId: string, obj: ITaskUpdate) => {
            let thunk = changeTaskTC(listId, taskId, obj);
            dispatch(thunk)
        },
        deleteTask: (listId: string, taskId: string) => {
            let thunk = deleteTaskTC(listId, taskId);
            dispatch(thunk)
        },
        changeListTitle: (listId: string, title: string) => {
            let thunk = changeListTitleTC(listId, title);
            dispatch(thunk)
        }
    }
};


export default connect(null, mdtp)(TodoList);