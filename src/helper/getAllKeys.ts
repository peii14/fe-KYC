type RequestObject = {
  designatedBank: string;
  status: string;
  timestamp: string;
};

type WalletObject = {
  walletAddress: string;
  request: RequestObject;
};

export function getAllKeys(obj: any) {
  let keys = [];
  for (let key in obj) {
    if (typeof obj[key] === "object") {
      keys = keys.concat(getAllKeys(obj[key]).map((k) => `${key}.${k}`));
    } else {
      keys.push(key);
    }
  }
  return keys;
}
export const extractWalletAddressAndRequest = (
  data: WalletObject[]
): RequestObject[] => {
  return data.map((walletObj) => ({
    walletAddress: walletObj.walletAddress,
    ...walletObj.request,
    AMLFlag: false.toString(),
  }));
};
export const splitCamelCaseStrings = (input: string[]): string[] => {
  const camelCaseSplitter = (str: string): string => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  };

  return input.map(camelCaseSplitter);
};

