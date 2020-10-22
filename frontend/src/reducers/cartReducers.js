import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
} from '../constants/cartConstants';

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;

      // Search for the item in state.cartItem
      const existItem = state.cartItems.find((x) => x.product === item.product);

      // if Found: Create new state.cartItems
      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            // product refers to the id of the product
            x.product === existItem.product ? item : x
          ),
        };
      } // if Not: Push to the Array
      else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item.product !== action.payload
        ),
      };

    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };
    default:
      return state;
  }
};
