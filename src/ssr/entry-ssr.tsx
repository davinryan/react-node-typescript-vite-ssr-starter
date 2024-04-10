import { renderToString } from 'react-dom/server';

import {Root} from '../client/pages/Root.tsx';

export const render = (data: never) => {
  return renderToString(<Root data={data} />);
};

export const getServerData = async () => {
  const response = await fetch('https://dummyjson.com/products/1');
  return await response.json();
};