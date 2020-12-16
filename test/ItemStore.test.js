const ItemStore = artifacts.require("./ItemStore.sol")

const assert = require('chai').assert

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('ItemStore', (accounts) => {
    let itemStore

    before(async () => {
        itemStore = await ItemStore.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
          const address = await itemStore.address
          assert.notEqual(address, 0x0)
          assert.notEqual(address, '')
          assert.notEqual(address, null)
          assert.notEqual(address, undefined)
        })
    
        it('has a name', async () => {
          const name = await itemStore.name()
          console.log(name)
          assert.equal(name, 'THA BEST E-SHOP')
        })
      })

    describe('item', async () => {
      let item, itemCount

      before(async() => {
          item = await itemStore.createItem('iPhone 8', 'New iPhone 8, still in box', 'img.jpg', web3.utils.toWei('1', 'wei'), {from : accounts[0]})
          itemCount = await itemStore.itemCount()
      })

      it('create item', async () => {
          assert.equal(itemCount, 1)
          const value = item.logs[0].args
          assert.equal(value.id.toNumber(), 1, 'id is correct')
          assert.equal(value.owner, accounts[0], 'owner is correct')
          assert.equal(value.name, 'iPhone 8', 'item name is correct')
          assert.equal(value.description, 'New iPhone 8, still in box', 'item description is correct')
          assert.equal(value.photoUrl, 'img.jpg', 'image photo url is correct')
          assert.equal(value.price, 1, 'item price is correct')
          assert.equal(value.isAvailable, true, 'item is available')
      })

      it('item creation rejected', async () => {
          await itemStore.createItem('', 'New iPhone 8, still in box', 'img.jpg', web3.utils.toWei('0.5', 'Ether'), {from : accounts[0]}).should.be.rejected
          await itemStore.createItem('iPhone 8', 'New iPhone 8, still in box', 'img.jpg', 0, {from : accounts[0]}).should.be.rejected
      })
    })

    describe('user item list', async () => {
      let item1, item2, item3
      var firstUserItem = []
      var secondUserItem = []

      before(async () => {
        item1 = await itemStore.createItem('iPhone 8', 'New iPhone 8, still in box', 'img.jpg', web3.utils.toWei('0.5', 'Ether'), {from : accounts[1]})
        item2 = await itemStore.createItem('iPhone 8', 'New iPhone 8, still in box', 'img.jpg', web3.utils.toWei('0.5', 'Ether'), {from : accounts[2]})
        item3 = await itemStore.createItem('iPhone 8', 'New iPhone 8, still in box', 'img.jpg', web3.utils.toWei('0.5', 'Ether'), {from : accounts[2]})
        firstUserItem.push(item1.logs[0].args.id.toNumber())
        secondUserItem.push(item2.logs[0].args.id.toNumber())
        secondUserItem.push(item3.logs[0].args.id.toNumber())
      })

      it('user item list should contain one item', async () => {
        var userItemCount
        await itemStore.getUserItemCount(accounts[1]).then((x) => {
          userItemCount = x.words[0]
          assert.equal(userItemCount, 1, 'item count is correct')
        })

        for(var i = 0; i < userItemCount; i++) {
          await itemStore.getUserItem(accounts[1], i).then((x) => {
            assert.equal(firstUserItem[i], x.words[0])
          })
        }
      })

      it('user item list should contain two items', async () => {
        var userItemCount
        await itemStore.getUserItemCount(accounts[2]).then((x) => {
          userItemCount = x.words[0]
          assert.equal(userItemCount, 2, 'item count is correct')
        })

        for(var i = 0; i < userItemCount; i++) {
          await itemStore.getUserItem(accounts[2], i).then((x) => {
            assert.equal(secondUserItem[i], x.words[0])
          })
        }
      })
    })

    describe('check users balance after selling item', async() => {
      let firstItem, firstItemId

      before(async () => {
        firstItem = await itemStore.createItem('iPhone 8', 'New iPhone 8, still in box', 'img.jpg', web3.utils.toWei('5', 'Wei'), {from : accounts[0]})
        firstItemId = firstItem.logs[0].args.id
      })

      it('sell item and check users balances', async () => {
        let oldSellerBalance, oldBuyerBalance, price
        let newSellerBalance, newBuyerBalance

        oldSellerBalance = await web3.eth.getBalance(accounts[0])
        oldSellerBalance = new web3.utils.BN(oldSellerBalance)

        oldBuyerBalance = await web3.eth.getBalance(accounts[1])
        oldBuyerBalance = new web3.utils.BN(oldBuyerBalance)

        price = web3.utils.toWei('1', 'Wei')
        price = new web3.utils.BN(price)
        
        await itemStore.sellItem(firstItemId, {from: accounts[1], value: web3.utils.toWei('1', 'Wei')})

        newSellerBalance = await web3.eth.getBalance(accounts[0])
        newSellerBalance = new web3.utils.BN(newSellerBalance)

        newBuyerBalance = await web3.eth.getBalance(accounts[1])
        newBuyerBalance = new web3.utils.BN(newBuyerBalance)

        var expectedSellerBalance = oldSellerBalance.add(price)

        assert.equal(expectedSellerBalance.toString(), newSellerBalance.toString(), 'seller balance is correct')
      })
    })

    describe('item owner', async () => {
      let firstItem, firstItemOwner, firstItemId

      before(async () => {
        firstItem = await itemStore.createItem('iPhone 8', 'New iPhone 8, still in box', 'img.jpg', web3.utils.toWei('5', 'Wei'), {from : accounts[4]})
        firstItemOwner = firstItem.logs[0].args.owner
        firstItemId = firstItem.logs[0].args.id
      })

      it('item count is correct before selling', async () => {
        await itemStore.getUserItemCount(accounts[4]).then((x) => {
          assert.equal(x.words[0], 1, 'sellers item count is correct')
        })

        await itemStore.getUserItemCount(accounts[5]).then((x) => {
            assert.equal(x.words[0], 0, 'buyers item count is correct')
          })
      })

      it('item owner changed', async () => {
        assert.equal(firstItemOwner, accounts[4], 'owner address is correct')

        var soldItem = await itemStore.sellItem(firstItemId, {from: accounts[5], value: web3.utils.toWei('1', 'Wei')})

        var soldItemOwner = soldItem.logs[0].args.owner

        assert.equal(soldItemOwner, accounts[5], 'sold item owner has changed')
      })

      it('item count is correct after selling', async () => {
        await itemStore.getUserItemCount(accounts[4]).then((x) => {
          assert.equal(x.words[0], 0, 'sellers item count is correct')
        })

        await itemStore.getUserItemCount(accounts[5]).then((x) => {
          assert.equal(x.words[0], 1, 'buyers item count is correct')
        })
      })

    })
})
