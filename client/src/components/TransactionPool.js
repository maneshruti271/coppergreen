import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';
import { Link } from 'react-router-dom';
import history from '../history';

import { FormGroup, FormControl} from 'react-bootstrap';


const POLL_INERVAL_MS = 10000;

class TransactionPool extends Component {
  state = { transactionPoolMap: {} , stakes:0};

  updatestakes = event => {
    this.setState({ stakes: Number(event.target.value) });
  }

  fetchTransactionPoolMap = () => {
    fetch(`${document.location.origin}/api/transaction-pool-map`)
      .then(response => response.json())
      .then(json => this.setState({ transactionPoolMap: json }));
  }

  fetchMineTransactions = () => {
    if(this.state.stakes>=75){
      fetch(`${document.location.origin}/api/mine-transactions`)
      .then(response => {
        if (response.status === 200) {
          alert('success');
          history.push('/blocks');
        } else {
          alert('The mine-transactions block request did not complete.');
        }
      });
    }
    else{
      alert('The stakes are insufficient. Better luck next time.');

    }
  }

  componentDidMount() {
    this.fetchTransactionPoolMap();

    this.fetchPoolMapInterval = setInterval(
      () => this.fetchTransactionPoolMap(),
      POLL_INERVAL_MS
    );
  }

  componentWillUnmount() {
    clearInterval(this.fetchPoolMapInterval);
  }

  render() {
    return (
      <div className='TransactionPool'>
        <div><Link to='/'>Home</Link></div>
        <h3>Transaction Pool</h3>
        {
          Object.values(this.state.transactionPoolMap).map(transaction => {
            return (
              <div key={transaction.id}>
                <hr />
                <Transaction transaction={transaction} />
              </div>
            )
          })
        }
        <hr />
        <br />
        <FormGroup>
          <FormControl
            input='text'
            placeholder='stakes'
            value={this.state.stakes}
            onChange={this.updatestakes}
          />
        </FormGroup>
        <br />
        <Button
          bsStyle="danger"
          onClick={this.fetchMineTransactions}
        >
          Mine the Transactions
        </Button>
      </div>
    )
  }
}

export default TransactionPool;