  const input = document.getElementById("search");
  let styl=false;
  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    allListings.forEach(list => {
      const title = list.title.innerText.toLowerCase();
      const description=list.description.innerText.toLowerCase();
      const country=list.country.innerText.toLowerCase();
      const location=list.location.innerText.toLowerCase();
      if (title.includes(value) || description.includes(value) || location.includes(value) || country.includes(value)) {
        styl=true;
      } 
      else{
        styl=false;
      }
    });
  });