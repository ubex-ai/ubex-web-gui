/**
 *
 * Asynchronously loads the component for CreativeCreator
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
