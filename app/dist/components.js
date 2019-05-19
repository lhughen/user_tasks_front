window.CreateUserTaskComponent = React.createClass({
    // initialize values
    getInitialState: function() {
        return {
            description: '',
            states: [],
            selectedStateValue: '',
            successCreation: null
        };
    },

    // on mount, get all states and store them in this component's state
    componentDidMount: function() {
        $('.page-header h1').text("Create task for " + this.props.userName);
    },

    // on unmount, stop getting states in case the request is still loading
    // componentWillUnmount: function() {
    // },

    // handle state change
    onStateChange: function(e) {
        this.setState({selectedStateValue: e.target.value});
    },

    // handle description change
    onDescriptionChange: function(e) {
        this.setState({description: e.target.value});
    },

    // handle save button clicked
    onSave: function(e){
        // data in the form
        var form_data={
            description: this.state.description,
            state: this.state.selectedStateValue
        };

        // submit form data to api
        $.ajax({
            url: "http://localhost:3000/api/users/" + this.props.userId + "/user_tasks.json",
            type : "POST",
            contentType : 'application/json',
            data : JSON.stringify(form_data),
            success : function(response) {
                this.setState({successCreation: 'success'});
                this.setState({description: ""});
                this.setState({selectedStateValue: ""});
            }.bind(this),
            error: function(xhr, resp, text){
                this.setState({successCreation: 'error'});
            }.bind(this)
        });

        e.preventDefault();
    },

    render: function() {
        // make states as option for the select tag.
        this.state.states = [
          { 'value': 'to_do', 'text': 'To do' },
          { 'value': 'done', 'text': 'Done' },
        ];
        var statesOptions = this.state.states.map(function(state){
            return (
                <option key={state.value} value={state.value}>{state.text}</option>
            );
        });

        /*
        - tell the user if a user was created
        - tell the user if unable to create user
        - button to go back to users list
        - form to create a user
        */
        return (
        <div>
            {

                this.state.successCreation == "success" ?
                    <div className='alert alert-success'>
                        Task was saved.
                    </div>
                : null
            }

            {

                this.state.successCreation == "error" ?
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

// component that contains the logic to delete a user
window.DeleteUserTaskComponent = React.createClass({
    getInitialState: function() {
        // Get this user fields from the data attributes we set on the
        // #content div, using jQuery
        return {
            successDelete: null
        };
    },

    // on mount, change header text
    componentDidMount: function(){
        $('.page-header h1').text("Delete " + this.props.userName + "'s stask");
    },

    // handle single row deletion
    onDelete: function(e){
        // submit form data to api
        $.ajax({
            url: "http://localhost:3000/api/users/" + this.props.userId + "/user_tasks/" + this.props.taskId + ".json",
            type : "DELETE",
            dataType : 'text',
            success : function(response) {
                this.props.changeAppMode('read_tasks');
            }.bind(this),
            error: function(xhr, resp, text){
              console.log(xhr, resp, text);
                this.setState({successDelete: 'error'});
            }.bind(this)
        });
    },

    render: function(){
        return (
            <div>
                {
                    this.state.successDelete == "error" ?
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

// component that contains all the logic and other smaller components
// that form the Read User Tasks view
window.ReadUserTasksComponent = React.createClass({
    getInitialState: function() {
        return {
            user_tasks: []
        };
    },

    // on mount, fetch all users and stored them as this component's state
    componentDidMount: function() {
        this.serverRequest = $.get("http://localhost:3000/api/users/" + this.props.userId + "/user_tasks.json", function (user_tasks) {
            this.setState({
                user_tasks: user_tasks
            });
        }.bind(this));
    },

    // on unmount, kill user fetching in case the request is still pending
    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    // render component on the page
    render: function() {
        var filteredUserTasks = this.state.user_tasks;
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
                    userTasks={filteredUserTasks}
                    userName={this.props.userName}
                    changeAppMode={this.props.changeAppMode} />
            </div>
        );
    }
});

// component that contains the logic to update a user
window.UpdateUserTaskComponent = React.createClass({
    getInitialState: function() {
        // Get this user fields from the data attributes we set on the
        // #content div, using jQuery
        return {
            description: '',
            states: [],
            selectedStateValue: '',
            successCreation: null
        };
    },

    // on mount, fetch all categories and one user data to stored them as this component's state
    componentDidMount: function(){
        // read one user data
        this.serverRequestUserTask = $.get("http://localhost:3000/api/users/" + this.props.userId + "/user_tasks/" + this.props.taskId + ".json",
            function (userTask) {
                this.setState({id: userTask.id});
                this.setState({description: userTask.description});
                this.setState({selectedStateValue: userTask.state});
            }.bind(this));

        $('.page-header h1').text('Update task');
    },

    // on unmount, kill categories fetching in case the request is still pending
    componentWillUnmount: function() {
        this.serverRequestUserTask.abort();
    },

    // handle name change
    onStateChange: function(e) {
        this.setState({selectedStateValue: e.target.value});
    },

    // handle description change
    onDescriptionChange: function(e) {
        this.setState({description: e.target.value});
    },

    // handle save changes button clicked
    onSave: function(e){
        // data in the form
        var form_data={
            description: this.state.description,
            state: this.state.selectedStateValue
        };

        // submit form data to api
        $.ajax({
            url: "http://localhost:3000/api/users/" + this.props.userId + "/user_tasks/" + this.props.taskId + ".json",
            type : "PUT",
            contentType : 'application/json',
            data : JSON.stringify(form_data),
            success : function(response) {
                this.setState({successUpdate: 'success'});
            }.bind(this),
            error: function(xhr, resp, text){
                this.setState({successUpdate: 'error'});
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
                    this.state.successUpdate == "success" ?
                        <div className='alert alert-success'>
                            Task was updated.
                        </div>
                    : null
                }

                {
                    this.state.successUpdate == "error" ?
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

// component for the whole user tasks table
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
// component that renders a single user task
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
    // initialize values
    getInitialState: function() {
        return {
            name: '',
            successCreation: null
        };
    },

    // on mount, get all categories and store them in this component's state
    componentDidMount: function() {
        $('.page-header h1').text('Create user');
    },

    // on unmount, stop getting categories in case the request is still loading
    // componentWillUnmount: function() {
    // },

    // handle name change
    onNameChange: function(e) {
        this.setState({name: e.target.value});
    },

    // handle save button clicked
    onSave: function(e){

        // data in the form
        var form_data={
            user: {
              name: this.state.name,
            }
        };

        // submit form data to api
        $.ajax({
            url: "http://localhost:3000/api/users.json",
            type : "POST",
            contentType : 'application/json',
            data : JSON.stringify(form_data),
            success : function(response) {
                this.setState({successCreation: 'success'});
                this.setState({name: ""});
            }.bind(this),
            error: function(xhr, resp, text){
                this.setState({successCreation: 'error'});
            }.bind(this)
        });

        e.preventDefault();
    },

    render: function() {
        return (
        <div>
            {

                this.state.successCreation == "success" ?
                    <div className='alert alert-success'>
                        User was saved.
                    </div>
                : null
            }

            {

                this.state.successCreation == "error" ?
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

// component that contains the logic to delete a user
window.DeleteUserComponent = React.createClass({
    getInitialState: function() {
        // Get this user fields from the data attributes we set on the
        // #content div, using jQuery
        return {
            successDelete: null
        };
    },

    // on mount, change header text
    componentDidMount: function(){
        $('.page-header h1').text('Delete user');
    },

    // handle single row deletion
    onDelete: function(e){

        // user to delete
        var userId = this.props.userId;

        // submit form data to api
        $.ajax({
            url: "http://localhost:3000/api/users/" + userId + ".json",
            type : "DELETE",
            dataType : 'text',
            success : function(response) {
                this.props.changeAppMode('read_users');
            }.bind(this),
            error: function(xhr, resp, text){
              console.log(xhr, resp, text);
                this.setState({successDelete: 'error'});
            }.bind(this)
        });
    },

    render: function(){
        return (
            <div>
                {
                    this.state.successDelete == "error" ?
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

// component that contains all the logic and other smaller components
// that form the Read Users view
window.ReadUsersComponent = React.createClass({
    getInitialState: function() {
        return {
            users: []
        };
    },

    // on mount, fetch all users and stored them as this component's state
    componentDidMount: function() {
        this.serverRequest = $.get("http://localhost:3000/api/users.json", function (users) {
            this.setState({
                users: users
            });
        }.bind(this));
    },

    // on unmount, kill user fetching in case the request is still pending
    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    // render component on the page
    render: function() {
        // list of users
        var filteredUsers = this.state.users;
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
                    users={filteredUsers}
                    changeAppMode={this.props.changeAppMode} />
            </div>
        );
    }
});

// component that contains the logic to update a user
window.UpdateUserComponent = React.createClass({
    getInitialState: function() {
        // Get this user fields from the data attributes we set on the
        // #content div, using jQuery
        return {
            id: 0,
            name: '',
            successCreation: null
        };
    },

    // on mount, fetch all categories and one user data to stored them as this component's state
    componentDidMount: function(){
        // read one user data
        var userId = this.props.userId;
        this.serverRequestUser = $.get("http://localhost:3000/api/users/" + userId + ".json",
            function (user) {
                this.setState({id: user.id});
                this.setState({name: user.name});
            }.bind(this));

        $('.page-header h1').text('Update user');
    },

    // on unmount, kill categories fetching in case the request is still pending
    componentWillUnmount: function() {
        this.serverRequestUser.abort();
    },

    // handle name change
    onNameChange: function(e){
        this.setState({name: e.target.value});
    },

    // handle save changes button clicked
    onSave: function(e){
        var userId = this.props.userId;

        // data in the form
        var form_data={
            name: this.state.name
        };

        // submit form data to api
        $.ajax({
            url: "http://localhost:3000/api/users/" + userId + ".json",
            type : "PUT",
            contentType : 'application/json',
            data : JSON.stringify(form_data),
            success : function(response) {
                this.setState({successUpdate: 'success'});
            }.bind(this),
            error: function(xhr, resp, text){
                this.setState({successUpdate: 'error'});
            }.bind(this)
        });

        e.preventDefault();
    },

    render: function() {
        return (
            <div>
                {
                    this.state.successUpdate == "success" ?
                        <div className='alert alert-success'>
                            User was updated.
                        </div>
                    : null
                }

                {
                    this.state.successUpdate == "error" ?
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

// component for the whole users table
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
// component that renders a single user
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
