import type { ethers } from 'ethers';

export const getAllowanceValue = async (
  contract: any,
  from: string,
  checkContractAddress: any,
): Promise<string> => {
  const allow = contract.allowance(from, checkContractAddress);
  return allow ? allow.toString() : '0';
};

export const approveToken = async (
  contract: any,
  contractAddressForApprove: string,
  value: string | number,
  fromAcc: string,
  gasPrice: string,
): Promise<ethers.TransactionResponse> => {
  const from = fromAcc;
  const approveParams: any = { gasPrice, from };
  return contract.approve(contractAddressForApprove, value, approveParams);
};

export const clearApproveToken = async (
  contract: any,
  contractAddressForDisapprove: string,
  fromAcc: string,
  gasPrice: string,
): Promise<ethers.TransactionResponse> => {
  const from = fromAcc;
  const allowanceValue = await getAllowanceValue(contract, from, contractAddressForDisapprove);
  const approveParams = { gasPrice, from };
  return contract
    .decreaseAllowance(contractAddressForDisapprove, allowanceValue, approveParams);
};
