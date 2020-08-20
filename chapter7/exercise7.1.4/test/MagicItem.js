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

  it('Get all tokens from owner', async () => {
    
    const instance = await MagicItem.deployed();

    for (let i = 0; i < accounts.length; i++){
      let tokens = await instance.tokensOfOwner(accounts[i]);
      let tokensList = "";
      for (let j = 0; j < tokens.length; j++){
        tokensList += tokens[j].toNumber()+", ";
      }
      console.log("Account "+i+" has "+tokens.length+" tokens :" + tokensList);
    }

  });

  it('Transfer a token between accounts', async () => {

    const instance = await MagicItem.deployed();

    let tokens = await instance.tokensOfOwner(accounts[1]);

    let index = 0;
    let tokenIdToTransfer = tokens[index++].toNumber();
    while ((tokenIdToTransfer >= 2000) && (index < tokens.length)) {
        tokenIdToTransfer = tokens[index++].toNumber();
    }

    console.log("TokenID to transfer =" + tokenIdToTransfer);

    await instance.transferFrom(accounts[1], accounts[4], tokenIdToTransfer, {from: accounts[1]});

    console.log("TokenID transferred =" + tokenIdToTransfer);

    balance = await instance.balanceOf(accounts[1]);
    assert.equal(balance.toNumber(), 3, "bad balance for account 1"); 

    balance = await instance.balanceOf(accounts[4]);
    assert.equal(balance.toNumber(), 1, "bad balance for account 1");

  });

  it('Get all tokens from owner after transfer', async () => {
    
    const instance = await MagicItem.deployed();

    for (let i = 0; i < accounts.length; i++){
      let tokens = await instance.tokensOfOwner(accounts[i]);
      let tokensList = "";
      for (let j = 0; j < tokens.length; j++){
        tokensList += tokens[j].toNumber()+", ";
      }
      console.log("Account "+i+" has "+tokens.length+" tokens :" + tokensList);
    }

  });

  it('Use a magic item', async () => {
    const instance = await MagicItem.deployed();

    let tokens = await instance.tokensOfOwner(accounts[1]);

    let result = await instance.use(tokens[0].toNumber(), {from: accounts[1]});

    console.log("Used tokenID = "+result.logs[0].args[0].toNumber()+ " Random = "+result.logs[0].args[1].toNumber());

  });

  it('List all tokens from owner after use', async () => {
    
    const instance = await MagicItem.deployed();

    for (let i = 0; i < accounts.length; i++){
      let tokens = await instance.tokensOfOwner(accounts[i]);
      let tokensList = "";
      for (let j = 0; j < tokens.length; j++){
        tokensList += tokens[j].toNumber()+", ";
      }
      console.log("Account "+i+" has "+tokens.length+" tokens :" + tokensList);
    }

  });

  /* it('should call a function that depends on a linked library', async () => {
    const metaCoinInstance = await MetaCoin.deployed();
    const metaCoinBalance = (await metaCoinInstance.getBalance.call(accounts[0])).toNumber();
    const metaCoinEthBalance = (await metaCoinInstance.getBalanceInEth.call(accounts[0])).toNumber();

    assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, 'Library function returned unexpected function, linkage may be broken');
  });
  it('should send coin correctly', async () => {
    const metaCoinInstance = await MetaCoin.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoStartingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await metaCoinInstance.sendCoin(accountTwo, amount, { from: accountOne });

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoEndingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();


    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  });*/
});
