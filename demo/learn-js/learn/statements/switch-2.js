//conditional switch

function getDiscount(ordTotal) {
  var discountPercent;

  switch (true) {
    case (ordTotal < 200):
      discountPercent = 5;
      break;

    case (ordTotal >= 200 && ordTotal < 1000):
      discountPercent = 10;
      break;

    case (ordTotal >= 1000):
      discountPercent = 20;
      break;

    default:
      discountPercent = 0;
      break;
  }

  return discountPercent;
}

console.log("Order Value: 150 | Discount: "+ getDiscount(150) );
console.log("Order Value: 750 | Discount: "+ getDiscount(750) );
console.log("Order Value: 1000 | Discount: "+ getDiscount(1000) );