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
