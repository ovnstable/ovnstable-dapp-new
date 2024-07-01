type ConstructorInput = {
    internalType: string;
    name: string;
    type: string;
};

type EventInput = {
    indexed: boolean;
    internalType: string;
    name: string;
    type: string;
};

type FunctionInput = {
    internalType: string;
    name: string;
    type: string;
};

type FunctionOutput = {
    internalType: string;
    name: string;
    type: string;
};

type AbiElement =
    | {
          inputs: ConstructorInput[];
          stateMutability: string;
          type: 'constructor';
      }
    | {
          anonymous: boolean;
          inputs: EventInput[];
          name: string;
          type: 'event';
      }
    | {
          inputs: FunctionInput[];
          name: string;
          outputs: FunctionOutput[];
          stateMutability: string;
          type: 'function';
      };

export type ContractAbi = {
    address: string;
    abi: AbiElement[];
};
