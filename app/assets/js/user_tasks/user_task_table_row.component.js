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
