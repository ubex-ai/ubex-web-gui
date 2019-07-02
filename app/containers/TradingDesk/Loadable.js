/**
 *
 * Asynchronously loads the component for TradingDesk
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
