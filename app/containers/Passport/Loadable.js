/**
 *
 * Asynchronously loads the component for Passport
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
