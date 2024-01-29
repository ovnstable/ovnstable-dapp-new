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
  const from = fromAcc;
  const approveParams: any = { gasPrice, from };
  return contract.methods.approve(contractAddressForApprove, value).send(approveParams);
};

export const clearApproveToken = async (
  contract: any,
  contractAddressForDisapprove: string,
  fromAcc: string,
  gasPrice: string,
) => {
  const from = fromAcc;
  const allowanceValue = await getAllowanceValue(contract, from, contractAddressForDisapprove);
  const approveParams = { gasPrice, from };
  return contract.methods
    .decreaseAllowance(contractAddressForDisapprove, allowanceValue).send(approveParams);
};
