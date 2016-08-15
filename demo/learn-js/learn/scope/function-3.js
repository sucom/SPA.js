var desc = "Global Product Description";

function updateProduct() {
  var desc = "Default Product Description";
  
  var updateProductDesc = function(){
    var desc = "Product description changed.";
  };
  
  updateProductDesc();
  
  console.log(desc)
  
}

updateProduct();

console.log(desc);