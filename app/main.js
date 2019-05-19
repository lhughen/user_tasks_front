var MainApp = React.createClass({displayName: "MainApp",

    // initial mode is 'read_users' mode
    getInitialState: function(){
        return {
            currentMode: 'read_users',
            params: {}
        };
    },

    // used when use clicks something that changes the current mode
    changeAppMode: function(newMode, options){
        this.setState({currentMode: newMode});
        if (options !== undefined){
            this.setState({params: options});
        }
    },

    // render the component based on current or selected mode
    render: function(){
        var modeComponent =
            React.createElement(ReadUsersComponent, {
            changeAppMode: this.changeAppMode});

        switch(this.state.currentMode){
            case 'read_users':
                break;
            case 'create':
                modeComponent = React.createElement(CreateUserComponent, {changeAppMode: this.changeAppMode});
                break;
            case 'update':
                modeComponent = React.createElement(UpdateUserComponent, {userId: this.state.params.userId, changeAppMode: this.changeAppMode});
                break;
            case 'delete':
                modeComponent = React.createElement(DeleteUserComponent, {userId: this.state.params.userId, changeAppMode: this.changeAppMode});
                break;
            case 'read_tasks':
                modeComponent = React.createElement(ReadUserTasksComponent, {userId: this.state.params.userId, userName: this.state.params.userName, changeAppMode: this.changeAppMode});
                break;
            case 'create_task':
                modeComponent = React.createElement(CreateUserTaskComponent, {userId: this.state.params.userId, userName: this.state.params.userName, changeAppMode: this.changeAppMode});
                break;
            case 'update_task':
                modeComponent = React.createElement(UpdateUserTaskComponent, {userId: this.state.params.userId, userName: this.state.params.userName, taskId: this.state.params.taskId, changeAppMode: this.changeAppMode});
                break;
            case 'delete_task':
                modeComponent = React.createElement(DeleteUserTaskComponent, {userId: this.state.params.userId, userName: this.state.params.userName, taskId: this.state.params.taskId, changeAppMode: this.changeAppMode});
                break;
            default:
                break;
        }

        return modeComponent;
    }
});

// go and render the whole React component on to the div with id 'content'
ReactDOM.render(
    React.createElement(MainApp, null),
    document.getElementById('content')
);
