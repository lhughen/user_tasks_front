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