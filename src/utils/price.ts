export const getPriceWithDiscount = (
  price: number,
  discountPercentage: number
) => {
  if (discountPercentage && discountPercentage > 0) {
    if (price) {
      return Math.round(price - (price * discountPercentage) / 100);
    }
  } else {
    return Math.round(price);
  }
};
