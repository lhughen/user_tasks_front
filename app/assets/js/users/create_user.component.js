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
