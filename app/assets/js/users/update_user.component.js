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
