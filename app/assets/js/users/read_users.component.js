window.ReadUsersComponent = React.createClass({
    getInitialState: function() {
        return {
            users: []
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get(window.apiUrl + "users.json", function (users) {
            this.setState({users: users});
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    render: function() {
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
                    users={this.state.users}
                    changeAppMode={this.props.changeAppMode} />
            </div>
        );
    }
});
