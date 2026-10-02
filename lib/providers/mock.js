const base = [
  { id:'1', title:'BMW 320d F30', year:2013, mileage:212000, price:31900, location:'Łódź' },
  { id:'2', title:'BMW 318d F30', year:2014, mileage:198000, price:34900, location:'Warszawa' },
  { id:'3', title:'BMW 320d F30', year:2012, mileage:241000, price:27900, location:'Poznań' },
  { id:'4', title:'BMW 320d F30', year:2015, mileage:176000, price:38900, location:'Kraków' },
  { id:'5', title:'BMW 318d F30', year:2013, mileage:225000, price:29900, location:'Wrocław' },
  { id:'6', title:'BMW 320d F30', year:2016, mileage:169000, price:41900, location:'Gdańsk' }
];

export async function searchListings(filters) {
  return base
    .filter(x => x.year >= Number(filters.yearFrom || 0))
    .filter(x => x.year <= Number(filters.yearTo || 9999))
    .filter(x => x.price <= Number(filters.priceMax || Infinity));
}
