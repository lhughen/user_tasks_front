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
