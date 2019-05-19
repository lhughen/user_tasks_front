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
        this.serverRequestUserTask = $.get("http://localhost:3000/api/users/" + this.props.userId + "/user_tasks/" + this.props.taskId + ".json",
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
            url: "http://localhost:3000/api/users/" + this.props.userId + "/user_tasks/" + this.props.taskId + ".json",
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
