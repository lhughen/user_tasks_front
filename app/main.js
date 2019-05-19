window.apiUrl = 'https://casemiro-second-app.herokuapp.com/api/';

var MainApp = React.createClass({displayName: "MainApp",

    getInitialState: function(){
        return {
            currentMode: 'read_users',
            params: {}
        };
    },

    changeAppMode: function(newMode, options){
        this.setState({currentMode: newMode});
        if (options !== undefined){
            this.setState({params: options});
        }
    },

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

ReactDOM.render(
    React.createElement(MainApp, null),
    document.getElementById('content')
);
