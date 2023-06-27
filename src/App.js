import { CameraOutlined } from '@ant-design/icons';
import { Card, Modal } from 'antd';
import { useState } from 'react';
import Upload from './component/Upload';
import axios from 'axios';
import LoginForm from './component/LoginForm';
import useUserStore from './store/userStore';
import SignUp from './component/SignUp';
import './App.css';

const { Meta } = Card;
const App = () => {
  const { setUsername, setAvatar, username, avatar, password, setPassword } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginToBE = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      const {
        avatar,
        password: userPassword,
        username: responseUsername,
      } = response.data.data.account;
      setUsername(responseUsername);
      setPassword(userPassword);
      setAvatar(avatar);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSignUpToBE = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
      });
      const {
        avatar,
        password: userPassword,
        username: responseUsername,
      } = response.data.data.account;
      setUsername(responseUsername);
      setPassword(userPassword);
      setAvatar(avatar);
    } catch (error) {
      console.error(error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleLogoutClick = () => {
    setUsername('');
    setPassword('');
    setAvatar('');
  };

  console.log('3333333', avatar, username, password);

  return (
    <div className="app">
      {username ? (
        <div className="logout">
          <button onClick={handleLogoutClick}>Logout</button>
        </div>
      ) : (
        <div className="authentication-main">
          <div className="auth">
            <h1>Login</h1>
            <LoginForm handleLoginToBE={handleLoginToBE} />
          </div>
          <div className="auth">
            <h1>Sign Up</h1>
            <SignUp handleSignUpToBE={handleSignUpToBE} />
          </div>
        </div>
      )}
      {username && (
        <div className="container">
          <Card
            style={{
              width: 300,
            }}
            cover={
              <img
                style={{
                  borderRadius: '50%',
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  margin: '10px auto',
                  border: '1px solid black',
                }}
                alt="example"
                src={`${avatar ? `${avatar}` : 'avarta.jpg'}`}
              />
            }
            actions={[
              <CameraOutlined key="change avatar" onClick={showModal} className="icon-container" />,
            ]}
          >
            <Meta
              style={{
                display: 'none',
              }}
            />
          </Card>
          <Modal
            title="Change Your Avatar"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
            footer={false}
          >
            <Upload />
          </Modal>
        </div>
      )}
    </div>
  );
};
export default App;
