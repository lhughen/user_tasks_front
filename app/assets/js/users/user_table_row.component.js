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
