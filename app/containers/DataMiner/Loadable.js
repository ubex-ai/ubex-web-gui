/**
 *
 * Asynchronously loads the component for DataMiner
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
