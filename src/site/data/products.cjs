module.exports = async function () {
  let url = `https://dummyjson.com/products`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.products)
    .catch(function (error) {
      console.log(error);
    });
};
