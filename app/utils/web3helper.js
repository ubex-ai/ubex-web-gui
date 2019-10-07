const ua = window.navigator.userAgent.toLowerCase();
const is_ie = /trident/gi.test(ua) || /msie/gi.test(ua);
// import Web3 from 'web3';
const Web3 = !is_ie ? require('web3') : null;
import { ethers } from 'ethers';
const infuraProvider = new ethers.providers.InfuraProvider('mainnet');
const UbexABI = [
	{
		constant: true,
		inputs: [],
		name: 'name',
		outputs: [{ name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_spender', type: 'address' }, { name: '_value', type: 'uint256' }],
		name: 'approve',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'totalSupply',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: '_from', type: 'address' },
			{ name: '_to', type: 'address' },
			{ name: '_value', type: 'uint256' },
		],
		name: 'transferFrom',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'decimals',
		outputs: [{ name: '', type: 'uint8' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [],
		name: 'unpause',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_value', type: 'uint256' }],
		name: 'burn',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'paused',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_spender', type: 'address' }, { name: '_subtractedValue', type: 'uint256' }],
		name: 'decreaseApproval',
		outputs: [{ name: 'success', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [{ name: '_owner', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [],
		name: 'pause',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'owner',
		outputs: [{ name: '', type: 'address' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'symbol',
		outputs: [{ name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }],
		name: 'transfer',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: '_spender', type: 'address' }, { name: '_addedValue', type: 'uint256' }],
		name: 'increaseApproval',
		outputs: [{ name: 'success', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [{ name: '_owner', type: 'address' }, { name: '_spender', type: 'address' }],
		name: 'allowance',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: 'newOwner', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ name: 'totalSupply', type: 'uint256' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{ anonymous: false, inputs: [], name: 'Pause', type: 'event' },
	{ anonymous: false, inputs: [], name: 'Unpause', type: 'event' },
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'previousOwner', type: 'address' },
			{ indexed: true, name: 'newOwner', type: 'address' },
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'burner', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
		],
		name: 'Burn',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'owner', type: 'address' },
			{ indexed: true, name: 'spender', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'from', type: 'address' },
			{ indexed: true, name: 'to', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
		],
		name: 'Transfer',
		type: 'event',
	},
];
const UbexAddress = '0x6704B673c70dE9bF74C8fBa4b4bd748F0e2190E1';

export async function fetchAccounts() {
	let accounts;
	let error;
	if (window.ethereum) {
		window.web3 = new Web3(ethereum);
		try {
			await ethereum.enable();
			const typeNetwork = await web3.eth.net.getNetworkType();
			if (typeNetwork !== 'main') {
				error = 'Select main network in Metamask!';
			} else {
				accounts = await web3.eth.getAccounts();
				if (!accounts && !accounts.length && !accounts[0].length) {
					error = 'Error getting address!';
				}
			}
		} catch (err) {
			console.log(err);
		}
	} else {
		error = 'Metamask is not installed!';
	}
	return { accounts, error };
}

export async function getUBEXBalance(address) {
	let balance;
	let err;
	try {
		const contract = await new ethers.Contract(UbexAddress, UbexABI, infuraProvider);
		balance = await contract.balanceOf(address);
		balance = parseInt(ethers.utils.formatEther(balance), 10);
	} catch (error) {
		err = 'Error check UBEX balance!';
	}
	return { balance, err };
}

export const transferUbex = ubex =>
	new Promise((resolve, reject) => {
		const Contract = web3.eth.contract(UbexABI);
		const contractInstance = Contract.at(UbexAddress);
		if (window.ethereum) {
			const ethereum = window.ethereum;
			const Web3 = window.Web3;
			const web3 = new Web3(ethereum);
			try {
				ethereum.enable().then(accounts => {
					const from = accounts[0];
					console.log(accounts[0]);
					contractInstance.transfer(
						'0x5B6A61ED8b87f42A83F4C3bb62E56028339a615F',
						ubex * 10 ** 18,
						{ from },
						(err, result) => {
							if (!err) {
								console.log(result);
								resolve(result);
							}
						},
					);
				});
			} catch (error) {
				reject(error);
			}
		} else if (window.web3) {
			const Web3 = window.Web3;
			const web3 = new Web3(window.web3.currentProvider);
			web3.eth.getAccounts().then(accounts => {
				const from = accounts[0];
				contractInstance.transfer(
					'0x5B6A61ED8b87f42A83F4C3bb62E56028339a615F',
					ubex * 10 ** 18,
					{ from },
					(err, result) => {
						if (!err) {
							console.log(result);
							resolve(result);
						}
					},
				);
			});
		} else {
			console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
		}
	});
