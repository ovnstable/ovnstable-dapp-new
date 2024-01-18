export const getAllowanceValue = async (
  contract: any,
  from: string,
  checkContractAddress: any,
) => contract
  .methods
  .allowance(from, checkContractAddress)
  .call();

export const approveToken = async (
  contract: any,
  contractAddressForApprove: string,
  value: string | number,
  fromAcc: string,
  gasPrice: string,
) => {
  console.log('approveToken: ', contract, contractAddressForApprove, value);
  const from = fromAcc;
  const approveParams: any = { gasPrice, from };

  console.log('approveToken: ', contract, contractAddressForApprove, value, approveParams);
  return contract.methods.approve(contractAddressForApprove, value).send(approveParams);
};

export const clearApproveToken = async (
  contract: any,
  contractAddressForDisapprove: string,
  fromAcc: string,
  gasPrice: string,
) => {
  console.log('clearApproveToken: ', contract, contractAddressForDisapprove);
  const from = fromAcc;
  const allowanceValue = await getAllowanceValue(contract, from, contractAddressForDisapprove);
  const approveParams = { gasPrice, from };

  console.log(
    'clearApproveToken: ',
    contract,
    contractAddressForDisapprove,
    allowanceValue,
    approveParams,
  );

  return contract.methods
    .decreaseAllowance(contractAddressForDisapprove, allowanceValue).send(approveParams);
};
