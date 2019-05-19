window.CreateUserTaskComponent = React.createClass({
    getInitialState: function() {
        return {
            description: '',
            states: [],
            selectedStateValue: '',
            responseStatus: null
        };
    },

    componentDidMount: function() {
        $('.page-header h1').text("Create task for " + this.props.userName);
    },

    onStateChange: function(e) {
        this.setState({selectedStateValue: e.target.value});
    },

    onDescriptionChange: function(e) {
        this.setState({description: e.target.value});
    },

    onSave: function(e){
        var form_data={
            description: this.state.description,
            state: this.state.selectedStateValue
        };

        $.ajax({
            url: window.apiUrl + "users/" + this.props.userId + "/user_tasks.json",
            type : "POST",
            contentType : 'application/json',
            data : JSON.stringify(form_data),
            success : function(response) {
                this.setState({responseStatus: 'success'});
                this.setState({description: ""});
                this.setState({selectedStateValue: ""});
            }.bind(this),
            error: function(xhr, resp, text){
                this.setState({responseStatus: 'error'});
            }.bind(this)
        });

        e.preventDefault();
    },

    render: function() {
        this.state.states = [
          { 'value': 'to_do', 'text': 'To do' },
          { 'value': 'done', 'text': 'Done' },
        ];
        var statesOptions = this.state.states.map(function(state){
            return (
                <option key={state.value} value={state.value}>{state.text}</option>
            );
        });

        return (
        <div>
            {

                this.state.responseStatus == "success" ?
                    <div className='alert alert-success'>
                        Task was saved.
                    </div>
                : null
            }

            {

                this.state.responseStatus == "error" ?
                    <div className='alert alert-danger'>
                        Unable to save task. Please try again.
                    </div>
                : null
            }

            <a href='#'
                onClick={() => this.props.changeAppMode('read_tasks')}
                className='btn btn-primary margin-bottom-1em'> {this.props.userName}'s tasks
            </a>

            <form onSubmit={this.onSave}>
                <table className='table table-bordered table-hover'>
                <tbody>
                    <tr>
                        <td>Description</td>
                        <td>
                            <input
                            type='text'
                            className='form-control'
                            value={this.state.description}
                            required
                            onChange={this.onDescriptionChange} />
                        </td>
                    </tr>

                    <tr>
                        <td>State</td>
                        <td>
                            <select
                            onChange={this.onStateChange}
                            className='form-control'
                            value={this.state.selectedStateValue}>
                            <option value="">Select state...</option>
                            {statesOptions}
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td></td>
                        <td>
                            <button
                            className='btn btn-primary'
                            onClick={this.onSave}>Save</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>
        );
    }
});

window.DeleteUserTaskComponent = React.createClass({
    getInitialState: function() {
        return {
            responseStatus: null
        };
    },

    componentDidMount: function(){
        $('.page-header h1').text("Delete " + this.props.userName + "'s stask");
    },

    onDelete: function(e){
        $.ajax({
            url: window.apiUrl + "users/" + this.props.userId + "/user_tasks/" + this.props.taskId + ".json",
            type : "DELETE",
            dataType : 'text',
            success : function(response) {
                this.props.changeAppMode('read_tasks');
            }.bind(this),
            error: function(xhr, resp, text){
              console.log(xhr, resp, text);
                this.setState({responseStatus: 'error'});
            }.bind(this)
        });
    },

    render: function(){
        return (
            <div>
                {
                    this.state.responseStatus == "error" ?
                        <div className='alert alert-danger'>
                            Unable to delete task. Please try again.
                        </div>
                    : null
                }

                <div className='row'>
                    <div className='col-md-3'></div>
                    <div className='col-md-6'>
                        <div className='panel panel-default'>
                            <div className='panel-body text-align-center'>Are you sure?</div>
                            <div className='panel-footer clearfix'>
                                <div className='text-align-center'>
                                    <button onClick={this.onDelete}
                                        className='btn btn-danger m-r-1em'>Yes</button>
                                    <button onClick={() => this.props.changeAppMode('read_tasks')}
                                        className='btn btn-primary'>No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3'></div>
                </div>
            </div>
        );
    }
});

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

window.UpdateUserTaskComponent = React.createClass({
    getInitialState: function() {
        return {
            description: '',
            states: [],
            selectedStateValue: '',
            responseStatus: null
        };
    },

    componentDidMount: function(){
        this.serverRequestUserTask = $.get(window.apiUrl + "users/" + this.props.userId + "/user_tasks/" + this.props.taskId + ".json",
            function (userTask) {
                this.setState({id: userTask.id});
                this.setState({description: userTask.description});
                this.setState({selectedStateValue: userTask.state});
            }.bind(this));

        $('.page-header h1').text('Update task');
    },

    componentWillUnmount: function() {
        this.serverRequestUserTask.abort();
    },

    onStateChange: function(e) {
        this.setState({selectedStateValue: e.target.value});
    },

    onDescriptionChange: function(e) {
        this.setState({description: e.target.value});
    },

    onSave: function(e){
        var form_data={
            description: this.state.description,
            state: this.state.selectedStateValue
        };

        $.ajax({
            url: window.apiUrl + "users/" + this.props.userId + "/user_tasks/" + this.props.taskId + ".json",
            type : "PUT",
            contentType : 'application/json',
            data : JSON.stringify(form_data),
            success : function(response) {
                this.setState({responseStatus: 'success'});
            }.bind(this),
            error: function(xhr, resp, text){
                this.setState({responseStatus: 'error'});
            }.bind(this)
        });

        e.preventDefault();
    },

    render: function() {
        this.state.states = [
          { 'value': 'to_do', 'text': 'To do' },
          { 'value': 'done', 'text': 'Done' },
        ];
        var statesOptions = this.state.states.map(function(state){
            return (
                <option key={state.value} value={state.value}>{state.text}</option>
            );
        });

        return (
            <div>
                {
                    this.state.responseStatus == "success" ?
                        <div className='alert alert-success'>
                            Task was updated.
                        </div>
                    : null
                }

                {
                    this.state.responseStatus == "error" ?
                        <div className='alert alert-danger'>
                            Unable to update task. Please try again.
                        </div>
                    : null
                }

                <a href='#'
                    onClick={() => this.props.changeAppMode('read_tasks')}
                    className='btn btn-primary margin-bottom-1em'> {this.props.userName}'s tasks
                </a>

                <form onSubmit={this.onSave}>
                    <table className='table table-bordered table-hover'>
                        <tbody>
                        <tr>
                            <td>Description</td>
                            <td>
                                <input
                                type='text'
                                className='form-control'
                                value={this.state.description}
                                required
                                onChange={this.onDescriptionChange} />
                            </td>
                        </tr>

                        <tr>
                            <td>State</td>
                            <td>
                                <select
                                onChange={this.onStateChange}
                                className='form-control'
                                value={this.state.selectedStateValue}>
                                <option value="">Select state...</option>
                                {statesOptions}
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <td></td>
                            <td>
                                <button
                                    className='btn btn-primary'
                                    onClick={this.onSave}>Save Changes</button>
                            </td>
                        </tr>

                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
});

window.UserTaskTable = React.createClass({
    render: function() {

    var rows = this.props.userTasks
        .map(function(userTask, i) {
            return (
                <UserTaskRow
                    key={i}
                    userTask={userTask}
                    userName={this.props.userName}
                    changeAppMode={this.props.changeAppMode} />
            );
        }.bind(this));

        return(
            !rows.length
                ? <div className='alert alert-danger'>No tasks found.</div>
                :
                <table className='table table-bordered table-hover'>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>State</th>
                            <th>Created at</th>
                            <th>Updated at</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
        );
    }
});
window.UserTaskRow = React.createClass({
    render: function() {
        var params = {
            userId: this.props.userTask.user_id,
            userName: this.props.userName,
            taskId: this.props.userTask.id
        }

        var states = [
            { 'value': 'to_do', 'text': 'To do' },
            { 'value': 'done', 'text': 'Done' },
        ];
        var friendly_state = "";
        for (var i = 0; i < states.length; i++) {
            if (states[i].value == this.props.userTask.state) {
                friendly_state = states[i].text;
                break;
            }
        }

        return (
            <tr>
                <td>{this.props.userTask.description}</td>
                <td>{friendly_state}</td>
                <td>{new Date(this.props.userTask.created_at).toLocaleString('en-US')}</td>
                <td>{new Date(this.props.userTask.updated_at).toLocaleString('en-US')}</td>
                <td>
                    <a href='#'
                        onClick={() => this.props.changeAppMode('update_task', params)}
                        className='btn btn-primary m-r-1em'> Edit
                    </a>
                    <a
                        onClick={() => this.props.changeAppMode('delete_task', params)}
                        className='btn btn-danger'> Delete
                    </a>
                </td>
            </tr>
        );
    }
});

window.CreateUserComponent = React.createClass({
    getInitialState: function() {
        return {
            name: '',
            responseStatus: null
        };
    },

    componentDidMount: function() {
        $('.page-header h1').text('Create user');
    },

    onNameChange: function(e) {
        this.setState({name: e.target.value});
    },

    onSave: function(e){
        var form_data={
            user: {
              name: this.state.name,
            }
        };

        $.ajax({
            url: window.apiUrl + "users.json",
            type : "POST",
            contentType : 'application/json',
            data : JSON.stringify(form_data),
            success : function(response) {
                this.setState({responseStatus: 'success'});
                this.setState({name: ""});
            }.bind(this),
            error: function(xhr, resp, text){
                this.setState({responseStatus: 'error'});
            }.bind(this)
        });

        e.preventDefault();
    },

    render: function() {
        return (
        <div>
            {

                this.state.responseStatus == "success" ?
                    <div className='alert alert-success'>
                        User was saved.
                    </div>
                : null
            }

            {

                this.state.responseStatus == "error" ?
                    <div className='alert alert-danger'>
                        Unable to save user. Please try again.
                    </div>
                : null
            }

            <a href='#'
                onClick={() => this.props.changeAppMode('read_users')}
                className='btn btn-primary margin-bottom-1em'> Back to list
            </a>

            <form onSubmit={this.onSave}>
                <table className='table table-bordered table-hover'>
                <tbody>
                    <tr>
                        <td>Name</td>
                        <td>
                            <input
                            type='text'
                            className='form-control'
                            value={this.state.name}
                            required
                            onChange={this.onNameChange} />
                        </td>
                    </tr>

                    <tr>
                        <td></td>
                        <td>
                            <button
                            className='btn btn-primary'
                            onClick={this.onSave}>Save</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>
        );
    }
});

window.DeleteUserComponent = React.createClass({
    getInitialState: function() {
        return {
            responseStatus: null
        };
    },

    componentDidMount: function(){
        $('.page-header h1').text('Delete user');
    },

    onDelete: function(e){
        $.ajax({
            url: window.apiUrl + "api/users/" + this.props.userId + ".json",
            type : "DELETE",
            dataType : 'text',
            success : function(response) {
                this.props.changeAppMode('read_users');
            }.bind(this),
            error: function(xhr, resp, text){
              console.log(xhr, resp, text);
                this.setState({responseStatus: 'error'});
            }.bind(this)
        });
    },

    render: function(){
        return (
            <div>
                {
                    this.state.responseStatus == "error" ?
                        <div className='alert alert-danger'>
                            Unable to delete user. Please try again.
                        </div>
                    : null
                }

                <div className='row'>
                    <div className='col-md-3'></div>
                    <div className='col-md-6'>
                        <div className='panel panel-default'>
                            <div className='panel-body text-align-center'>Are you sure?</div>
                            <div className='panel-footer clearfix'>
                                <div className='text-align-center'>
                                    <button onClick={this.onDelete}
                                        className='btn btn-danger m-r-1em'>Yes</button>
                                    <button onClick={() => this.props.changeAppMode('read_users')}
                                        className='btn btn-primary'>No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3'></div>
                </div>
            </div>
        );
    }
});

window.ReadUsersComponent = React.createClass({
    getInitialState: function() {
        return {
            users: []
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get(window.apiUrl + "users.json", function (users) {
            this.setState({users: users});
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    render: function() {
        $('.page-header h1').text('List of users');

        return (
            <div className='overflow-hidden'>
                <div>
                    <a href='#'
                        onClick={() => this.props.changeAppMode('create')}
                        className='btn btn-primary margin-bottom-1em'> Create user
                    </a>
                </div>

                <UsersTable
                    users={this.state.users}
                    changeAppMode={this.props.changeAppMode} />
            </div>
        );
    }
});

window.UpdateUserComponent = React.createClass({
    getInitialState: function() {
        return {
            id: 0,
            name: '',
            responseStatus: null
        };
    },

    componentDidMount: function(){
        this.serverRequestUser = $.get(window.apiUrl + "users/" + this.props.userId + ".json",
            function (user) {
                this.setState({id: user.id});
                this.setState({name: user.name});
            }.bind(this));

        $('.page-header h1').text('Update user');
    },

    componentWillUnmount: function() {
        this.serverRequestUser.abort();
    },

    onNameChange: function(e){
        this.setState({name: e.target.value});
    },

    onSave: function(e){
        var form_data = {name: this.state.name};

        $.ajax({
            url: window.apiUrl + "users/" + this.props.userId + ".json",
            type : "PUT",
            contentType : 'application/json',
            data : JSON.stringify(form_data),
            success : function(response) {
                this.setState({responseStatus: 'success'});
            }.bind(this),
            error: function(xhr, resp, text){
                this.setState({responseStatus: 'error'});
            }.bind(this)
        });

        e.preventDefault();
    },

    render: function() {
        return (
            <div>
                {
                    this.state.responseStatus == "success" ?
                        <div className='alert alert-success'>
                            User was updated.
                        </div>
                    : null
                }

                {
                    this.state.responseStatus == "error" ?
                        <div className='alert alert-danger'>
                            Unable to update user. Please try again.
                        </div>
                    : null
                }

                <a href='#'
                    onClick={() => this.props.changeAppMode('read_users')}
                    className='btn btn-primary margin-bottom-1em'> Back to list
                </a>

                <form onSubmit={this.onSave}>
                    <table className='table table-bordered table-hover'>
                        <tbody>
                        <tr>
                            <td>Name</td>
                            <td>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={this.state.name}
                                    required
                                    onChange={this.onNameChange} />
                            </td>
                        </tr>

                        <tr>
                            <td></td>
                            <td>
                                <button
                                    className='btn btn-primary'
                                    onClick={this.onSave}>Save Changes</button>
                            </td>
                        </tr>

                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
});

window.UsersTable = React.createClass({
    render: function() {

    var rows = this.props.users
        .map(function(user, i) {
            return (
                <UserRow
                    key={i}
                    user={user}
                    changeAppMode={this.props.changeAppMode} />
            );
        }.bind(this));

        return(
            !rows.length
                ? <div className='alert alert-danger'>No users found.</div>
                :
                <table className='table table-bordered table-hover'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Created at</th>
                            <th>Updated at</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
        );
    }
});

window.UserRow = React.createClass({
    render: function() {
    return (
        <tr>
            <td>{this.props.user.name}</td>
            <td>{new Date(this.props.user.created_at).toLocaleString('en-US')}</td>
            <td>{new Date(this.props.user.updated_at).toLocaleString('en-US')}</td>
            <td>
                <a href='#'
                    onClick={() => this.props.changeAppMode('read_tasks', { userId: this.props.user.id, userName: this.props.user.name })}
                    className='btn btn-info m-r-1em'> Tasks
                </a>
                <a href='#'
                    onClick={() => this.props.changeAppMode('update', { userId: this.props.user.id })}
                    className='btn btn-primary m-r-1em'> Edit
                </a>
                <a
                    onClick={() => this.props.changeAppMode('delete', { userId: this.props.user.id })}
                    className='btn btn-danger'> Delete
                </a>
            </td>
        </tr>
        );
    }
});
