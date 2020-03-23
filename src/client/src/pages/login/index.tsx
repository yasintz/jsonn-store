import React from 'react';
import axios from 'axios';
import { PageComponent } from '..';

interface LoginPageProps {}

const Login: PageComponent<LoginPageProps> = props => {
  const [user, setUser] = React.useState({ username: 'yok la', token: '' });
  const buttons = [
    {
      text: 'Login',
      onClick: () => {
        axios.post('/auth/login', { username: 'yasintz', password: '12345' }).then(i => {
          setUser(i.data);
        });
      },
    },
    {
      text: 'Logout',
      onClick: () => axios.post('/auth/logout'),
    },
    {
      text: 'With Token',
      onClick: () => {
        axios.get('/api/test', { headers: { Authorization: user.token } });
      },
    },
    {
      text: 'Without Token',
      onClick: () => {
        axios.get('/api/test');
      },
    },
  ];

  return (
    <>
      <div>{user.username}</div>
      <div>
        {buttons.map(item => (
          <button onClick={item.onClick} type="button" key={item.text}>
            {item.text}
          </button>
        ))}
      </div>
    </>
  );
};

Login.getInitialProps = ({ req }) => {
  return {};
};

export default Login;
