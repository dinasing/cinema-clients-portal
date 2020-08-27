import React from 'react';
import { Container } from 'reactstrap';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from './AppNavbar';
import Routes from './Routes';
import { store } from '../../store';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <AppNavbar />
          <Container>
            <Routes />
          </Container>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
