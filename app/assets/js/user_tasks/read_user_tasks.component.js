window.ReadUserTasksComponent = React.createClass({
    getInitialState: function() {
        return {
            userTasks: []
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get(window.apiUrl + "users/" + this.props.userId + "/user_tasks.json", function (userTasks) {
            this.setState({userTasks: userTasks});
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    render: function() {
        $('.page-header h1').text(this.props.userName + "'s tasks");

        return (
            <div className='overflow-hidden'>
                <a href='#'
                    onClick={() => this.props.changeAppMode('read_users')}
                    className='btn btn-info margin-bottom-1em m-r-1em'> Back to users
                </a>

                <a href='#'
                    onClick={() => this.props.changeAppMode('create_task')}
                    className='btn btn-primary margin-bottom-1em m-r-1em'> Create task
                </a>

                <UserTaskTable
                    userTasks={this.state.userTasks}
                    userName={this.props.userName}
                    changeAppMode={this.props.changeAppMode} />
            </div>
        );
    }
});
