import React from 'react';
import store from './store';
import {loadUser} from './actions/authActions';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './components/routed/Login/Login';
import Register from './components/routed/Register/Register';
import Overview from './components/routed/Overview/Overview';
import NewTransaction from './components/routed/NewTransaction/NewTransaction';
import {fetchRate} from "./actions/rateActions";
import TransactionsList from "./components/routed/TransactionsList/TransactionsList";
import socketIOClient from 'socket.io-client'
import {Transaction} from "./types/Transaction";
import {transactionsReceived} from "./actions/transactionAction";

export class App extends React.Component {

  constructor(props: any) {
    super(props);
    store.dispatch(loadUser());
    store.dispatch(fetchRate());
  }

  componentDidMount() {
      const socket = socketIOClient('http://localhost:4000/');
      socket.on("new", (transaction: Transaction) => {
        // @ts-ignore
        let transactions = store.getState().transaction.transactions
        transactions.push(transaction)
        store.dispatch(transactionsReceived(transactions))
      });
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path='/overview' component={Overview}/>
            <Route path='/new' component={NewTransaction}/>
            <Route path='/transactions' component={TransactionsList}/>
            <Route path='/login' component={Login}/>
            <Route path='/register' component={Register}/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
