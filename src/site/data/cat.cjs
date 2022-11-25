module.exports = async function () {
    let url = `https://catfact.ninja/fact`;
    return fetch(url)
      .then((response) => response.json())
      .then((data) => data)
      .catch(function (error) {
        console.log(error);
      });
  };
  