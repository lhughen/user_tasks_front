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
