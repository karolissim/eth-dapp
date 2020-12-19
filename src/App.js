import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import ItemStore from 'abis/contracts/ItemStore.json'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import Navbar from './components/Navbar';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loginModal: false,
      signupModal: false,
      account: '',
      loading: true,
      itemCount: 0,
      items: []
    }
  }

  selectLoginModal = () => {
    this.setState({ loginModal: !this.state.loginModal})
  }

  selectSignupModal = () => {
    this.setState({ signupModal: !this.state.signupModal})
  }

  async UNSAFE_componentWillMount() {
    await this.loadWeb3()
    await this.loadContract()
  }

  async loadContract() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = ItemStore.networks[networkId]
    if (networkData) {
      const itemStore = new web3.eth.Contract(ItemStore.abi, networkData.address)
      this.setState({itemStore})
      const itemCount = await itemStore.methods.itemCount().call()
      this.setState({items: []})
      for(var i = 0; i < itemCount; i++) {
        var item = await itemStore.methods.items(i).call()
        this.setState({items: [...this.state.items, item]})
      }
      // window.alert(itemCount)
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  render() {
    var columns = []
    for(var i = 0; i < 8; i++) {
      columns.push(
        <div class="col">
          <div className="item-container">
            <div className="img-container">
              <img className="item-img" src="https://static01.nyt.com/images/2020/04/22/science/22VIRUS-PETCATS1/merlin_150476541_233fface-f503-41af-9eae-d90a95eb6051-superJumbo.jpg?quality=90&auto=webp"></img>
            </div>
            <h2 className="item-name">iPhone 8</h2>
            <h2 className="item-price">100 ETH</h2>
          </div>
          
        </div>
      )
    }
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/">
              <div className="login-page">
                <div>
                  <h1 className="page-name">BRANGU.LT</h1>
                  <button type="button" class="btn btn-outline-primary btn-lg login-button" onClick={this.selectLoginModal}>Log in</button>
                  <button type="button" class="btn btn-outline-primary btn-lg login-button" onClick={this.selectSignupModal}>Sign up</button>
                </div>
                <LoginModal
                  displayLoginModal={this.state.loginModal}
                  closeLoginModal={this.selectLoginModal}/>
                <SignupModal
                  displaySignupModal={this.state.signupModal}
                  closeSignupModal={this.selectSignupModal}/>
              </div>
            </Route>
            <Route path="/shop">
              <Navbar />
              <div class="container">
                <div class="row">{ columns }</div>
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
