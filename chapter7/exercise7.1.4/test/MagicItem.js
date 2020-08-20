const MagicItem = artifacts.require("MagicItemBase");

contract('MagicItemBase', (accounts) => {
  it('should display 0 magicitem', async () => {
    const instance = await MagicItem.deployed();
    const totalSupply = await instance.totalSupply();

    assert.equal(totalSupply.valueOf(), 0, "Intial totalSupply is wrong");
  });

  it('all accounts should have 0 magic item', async () => {
    const instance = await MagicItem.deployed();
    
    for (let i = 0; i < accounts.length; i++){
      let balance = await instance.balanceOf(accounts[i]);
      assert.equal(balance.valueOf(), 0, "Intial balance for account "+i+" is wrong");
    }
  });

  it('Account 1 digs twice', async () => {
    
    const instance = await MagicItem.deployed();

    let result = await instance.dig({from: accounts[1], value: web3.utils.toWei("0.1", "ether")});
    result = await instance.dig({from: accounts[1], value: web3.utils.toWei("0.1", "ether")});

    let totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.valueOf(), 2, "TotalSupply is wrong");

    let balance = await instance.balanceOf(accounts[1]);
    assert.equal(balance.valueOf(), 2, "Balance for account "+1+" is wrong");
  });


  it('Multiple accounts dig', async () => {
    
    const instance = await MagicItem.deployed();

    /* Account 1 digs twice again */
    let result = await instance.dig({from: accounts[1], value: web3.utils.toWei("0.1", "ether")});
    result = await instance.dig({from: accounts[1], value: web3.utils.toWei("0.1", "ether")});

    /* Account 2 digs three times */
    result = await instance.dig({from: accounts[2], value: web3.utils.toWei("0.1", "ether")});
    result = await instance.dig({from: accounts[2], value: web3.utils.toWei("0.1", "ether")});
    result = await instance.dig({from: accounts[2], value: web3.utils.toWei("0.1", "ether")});
    
    /* Account 3 digs twice */
    result = await instance.dig({from: accounts[3], value: web3.utils.toWei("0.1", "ether")});
    result = await instance.dig({from: accounts[3], value: web3.utils.toWei("0.1", "ether")});

    let totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.valueOf(), 9, "TotalSupply is wrong = " + totalSupply.valueOf());

    let balance = await instance.balanceOf(accounts[1]);
    assert.equal(balance.valueOf(), 4, "Balance for account "+1+" is wrong = "+balance.valueOf());

    balance = await instance.balanceOf(accounts[2]);
    assert.equal(balance.valueOf(), 3, "Balance for account "+2+" is wrong = "+balance.valueOf());

    balance = await instance.balanceOf(accounts[3]);
    assert.equal(balance.valueOf(), 2, "Balance for account "+3+" is wrong = "+balance.valueOf());
  });

  it('Get all tokens per owner', async () => {
    
    const instance = await MagicItem.deployed();

    for (let i = 0; i < accounts.length; i++){
      let balance = await instance.balanceOf(accounts[i]);
      let tokensList = ""; 
      for (let j = 0; j < balance; j++){
        let token = await instance.tokenOfOwnerByIndex(accounts[i], j); 
        tokensList += token.toNumber()+", "; 
      }
      console.log("Account "+i+" has tokens :" + tokensList);
    }
  });

  it('Transfer a token between accounts', async () => {

    const instance = await MagicItem.deployed();
    let balance = await instance.balanceOf(accounts[1]);
    let index = 0;
    let token = await instance.tokenOfOwnerByIndex(accounts[1], index++);
    while ((token.toNumber() >= 2000) && (index < balance)) {
        token = await instance.tokenOfOwnerByIndex(accounts[1], index++);
    }

    console.log("TokenID to transfer =" + token.toNumber());

    await instance.transferFrom(accounts[1], accounts[4], token.toNumber(), {from: accounts[1]});

    console.log("TokenID transferred =" + token.toNumber());

    balance = await instance.balanceOf(accounts[1]);
    assert.equal(balance.toNumber(), 3, "bad balance for account 1"); 

    balance = await instance.balanceOf(accounts[4]);
    assert.equal(balance.toNumber(), 1, "bad balance for account 1");

  });

  it('Get all tokens per owner after transfer', async () => {
    
    const instance = await MagicItem.deployed();

    for (let i = 0; i < accounts.length; i++){
      let balance = await instance.balanceOf(accounts[i]);
      let tokensList = ""; 
      for (let j = 0; j < balance; j++){
        let token = await instance.tokenOfOwnerByIndex(accounts[i], j); 
        tokensList += token.toNumber()+", "; 
      }
      console.log("Account "+i+" has tokens :" + tokensList);
    }
  });


  it('Use a magic item', async () => {
    const instance = await MagicItem.deployed();

    let token = await instance.tokenOfOwnerByIndex(accounts[1], 0);

    let result = await instance.use(token.toNumber(), {from: accounts[1]});

    console.log("Used tokenID = "+result.logs[0].args[0].toNumber()+ " Random = "+result.logs[0].args[1].toNumber());

  });

  it('Get all tokens per owner after transfer after use', async () => {
    
    const instance = await MagicItem.deployed();

    for (let i = 0; i < accounts.length; i++){
      let balance = await instance.balanceOf(accounts[i]);
      let tokensList = ""; 
      for (let j = 0; j < balance; j++){
        let token = await instance.tokenOfOwnerByIndex(accounts[i], j); 
        tokensList += token.toNumber()+", "; 
      }
      console.log("Account "+i+" has tokens :" + tokensList);
    }
  });
});
