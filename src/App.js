import React, { Component } from 'react'
import './App.css'
import Web3 from 'web3'
import ItemStore from 'abis/contracts/ItemStore.json'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginModal from './components/LoginModal'
import SignupModal from './components/SignupModal'
import Navbar from './components/Navbar'
import Sell from './components/Sell'
import Item from './components/Item'

class App extends Component {
  constructor(props) {
    super(props)
    this.createUser = this.createUser.bind(this)
    this.login = this.login.bind(this)
    this.createItem = this.createItem.bind(this)
    this.buyItem = this.buyItem.bind(this)
    this.state = {
      loginModal: false,
      signupModal: false,
      isVerified: false,
      account: '',
      username: '',
      email: '',
      loading: true,
      itemCount: 0,
      items: [],
      userItems: []
    }
  }

  selectLoginModal = () => {
    this.setState({ loginModal: !this.state.loginModal })
  }

  selectSignupModal = () => {
    this.setState({ signupModal: !this.state.signupModal })
  }

  logoutUser = () => {
    this.setState({
      isVerified: false,
      account: '',
      username: '',
      email: ''
    })
  }

  async UNSAFE_componentWillMount() {
    await this.loadWeb3()
    await this.loadContract()
  }

  async loadContract() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    console.log(this.state.account)
    const networkId = await web3.eth.net.getId()
    const networkData = ItemStore.networks[networkId]
    if (networkData) {
      const itemStore = new web3.eth.Contract(ItemStore.abi, networkData.address)
      this.setState({ itemStore })
      const itemCount = await itemStore.methods.itemCount().call()
      const userCount = await itemStore.methods.userCount().call()
      this.setState({ items: [] })
      for (var i = 1; i <= itemCount; i++) {
        const item = await itemStore.methods.items(i).call()
        if(item.owner === this.state.account) {
          this.setState({ items: [...this.state.items, item], userItems: [...this.state.userItems, item] })
        } else {
          this.setState({ items: [...this.state.items, item] })
        }
      }
      console.log("all items: " + JSON.stringify(this.state.items))
      console.log("all user items: " + JSON.stringify(this.state.userItems))
      console.log("user count: " + userCount)
      console.log("item count: " + itemCount)
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

  createUser(username, password, email) {
    this.state.itemStore.methods
      .createUser(username, password, email)
      .send({ from: this.state.account })
      .on('confirmation', async function (_confirmationNumber, _receipt) {
        await this.loadContract()
      })
  }

  login(email, password) {
    this.state.itemStore.methods.signupUser(email, password).call().then((res) => {
      this.setState({
        username: res.username,
        email: res.email,
        isVerified: true
      })
    })
  }

  createItem(name, description, photoUrl, price) {
    this.state.itemStore.methods
      .createItem(name, description, photoUrl, price)
      .send({ from: this.state.account })
      .on('confirmation', async (_confirmationNumber, _receipt) => {
        await this.loadContract()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  buyItem(id) {
    this.state.itemStore.methods
      .sellItem(id)
      .send({ from: this.state.account })
      .once('receipt', async (_receipt) => {
        await this.loadContract()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    var columns = []
    for (var i = 0; i < 8; i++) {
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
            <Route exact path="/">
              <div className="login-page">
                <div>
                  <h1 className="page-name">BRANGU.LT</h1>
                  <button type="button" class="btn btn-outline-primary btn-lg login-button" onClick={this.selectLoginModal}>Log in</button>
                  <button type="button" class="btn btn-outline-primary btn-lg login-button" onClick={this.selectSignupModal}>Sign up</button>
                </div>
                <LoginModal
                  displayLoginModal={this.state.loginModal}
                  closeLoginModal={this.selectLoginModal}
                  login={this.login}
                  isVerified={this.state.isVerified} />
                <SignupModal
                  displaySignupModal={this.state.signupModal}
                  closeSignupModal={this.selectSignupModal}
                  createUser={this.createUser} />
              </div>
            </Route>
            <Route path="/shop">
              <Navbar
                logout={this.logoutUser} />
              <div className="spacer-large"></div>
              <div className="container">
                <div className="row">
                  {this.state.items.map((item, _id) => {
                    return (
                      <React.Fragment>
                        <Item
                          item={item}
                          buyItem={this.buyItem} />
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            </Route>
            <Route path="/items">
              <Navbar
                logout={this.logoutUser} />
              <div className="spacer-large"></div>
              <div className="container">
                <div className="row">
                  {this.state.userItems.map((item, _id) => {
                    return (
                      <React.Fragment>
                        <Item
                          item={item}
                          buyItem={this.buyItem} />
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            </Route>
            <Route path="/sell">
              <Navbar
                logout={this.logoutUser} />
              <Sell
                createItem={this.createItem} />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
