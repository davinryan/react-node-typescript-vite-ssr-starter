import {hydrateRoot} from 'react-dom/client'

import {Root} from './pages/Root.tsx'

const data = typeof window !== 'undefined' ? (window)['__data__'] : undefined;

hydrateRoot(document.getElementById('root') as Element, <Root data={data}/>)