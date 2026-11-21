import { handle } from '../server/shop.mjs'

export default { fetch: request => handle(request, 'orders') }
