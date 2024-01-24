export const getImageUrl = (path: string) => new URL(`../${path}`, import.meta.url).href;

export const svgIconsMap = (() => {
  function getSvgNameFromPath(path: string) {
    const pathSplit = path.split('/');
    const fileName = pathSplit[pathSplit.length - 1] || '';
    const svgName = fileName.replace('.svg', '');

    return svgName;
  }

  const modules = import.meta.glob('@/assets/icons/**/*.svg', {
    import: 'default',
    eager: true,
  });

  const svgMap = new Map();

  Object.keys(modules).forEach((path) => {
    const svgName = getSvgNameFromPath(path);
    svgMap.set(svgName, modules[path]);
  });

  return svgMap;
})();

export const appNetworksData = [
  {
    chain: 10,
    name: 'Optimism',
    color: 'red',
  },
  {
    chain: 42161,
    name: 'Arbitrum',
    color: 'blue',
  },
  {
    chain: 8453,
    name: 'Base',
    color: 'blue',
  },
  {
    chain: 59144,
    name: 'Linea',
    color: 'black',
  },
  {
    chain: 56,
    name: 'BSC',
    color: 'yellow',
  },
  {
    chain: 324,
    name: 'ZkSync',
    color: 'red',
  },
  {
    chain: 137,
    name: 'Polygon',
    color: 'red',
  },
];
