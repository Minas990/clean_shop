import { OrderCanceledHandler } from "./order-canceled.handelrt";
import { OrderConfirmedEventHandler } from "./order-confirmed.handler";
import { OrderDeliveredHandler } from "./order-delivered.handler";
import { OrderPlacetHandler } from "./order-place.handler";
import { OrderShippedEventHandler } from "./order-shipped.handler";

export const EventHadnlers = [
    OrderConfirmedEventHandler,
    OrderPlacetHandler,
    OrderShippedEventHandler,
    OrderDeliveredHandler,
    OrderCanceledHandler
];
