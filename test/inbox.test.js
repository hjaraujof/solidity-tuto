const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

// Initial variables
let accounts;
let inbox;
let initialString = 'Hi there';
let initialGas = '1000000';

// Initialize every variable needed for the tests!
beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy( { data: bytecode, arguments: [initialString] } )
        .send({ from: accounts[0], gas: initialGas });
    inbox.setProvider(provider);
});

describe('Inbox', () => {

    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.getMessage().call();
        assert.equal(message,initialString);
    });

    it('message can be changed', async () => {
        const message = 'Test message';
        //remember we have to pay the gas for changes on the Blockchain
        await inbox.methods.setMessage(message).send({ from: accounts[0] });
        
        const retrievedMsg = await inbox.methods.getMessage().call();
        assert.equal(retrievedMsg,message);
    });

});