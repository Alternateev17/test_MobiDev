const CITIES_DATA = {
  Lubek: {
    salt: 20,
    fish: 50,
    fabric: 60,
    cuper: 36,
    fur: 96,
  },

  Revel: {
    salt: 35,
    fish: 50,
    fabric: 40,
    cuper: 60,
    fur: 45,
  },

  Bergen: {
    salt: 62,
    fish: 15,
    fabric: 18,
    cuper: 82,
    fur: 54
  },
};

const INITIAL_BUDGET = 50;

// ----------------------------------------

/**

* Main class, iterates over all possible routes and finds the most profitable.

*/

class Trip {
  constructor(cities_data, initial_budget) {
    this.cities_data = cities_data;

    this.initial_budget = initial_budget;
  }

  findPath() {
    let routes = this._getRoutes(this.cities_data);

    let bestPath;

    for (let path_cities of routes) {
      let path = new Path(path_cities, this.cities_data, this.initial_budget);

      if (!bestPath || bestPath.getPathProfit() < path.getPathProfit()) {
        bestPath = path;
      }
    }

    return bestPath;
  }

  _getRoutes(items) {
    return new Combinator(Object.keys(items)).generateCombos();
  }
}

/**

* Class represents single route.

* Allows to calculate maximum profit that can be made after passing all cities on the path.

*/

class Path {
  constructor(pathCities, citiesData, initialBudget) {
    this.pathCities = pathCities;

    this.citiesData = citiesData;

    this.initialBudget = initialBudget;

    this.pathSegments = this._createPathSegments(pathCities, citiesData);

    this.pathProfit = null;
  }

  _createPathSegments(cities, citiesData) {
    let segments = [];

    for (let i = 0; i < cities.length - 1; i++) {
      let startCityName = cities[i];

      let destinationCityName = cities[i + 1];

      let pathPart = new PathSegment(
        startCityName,
        destinationCityName,
        citiesData
      );

      segments.push(pathPart);
    }

    return segments;
  }

  getPathCities() {
    return this.pathCities;
  }

  getPathProfit() {
    if (this.pathProfit === null) {
      // need to be calculated only once

      let budget = this.initialBudget;

      for (let pathSegment of this.pathSegments) {
        pathSegment.calculateForBudget(budget);

        budget = pathSegment.getBestResultingBudget();
      }

      this.pathProfit = budget;
    }

    return this.pathProfit;
  }

  getPathSegments() {
    return this.pathSegments;
  }

  printDetails() {
    let pathSegments = this.getPathSegments();

    let rows = [];

    rows.push("Best route is " + this.getPathCities().join(" --> "));

    rows.push("Details: ");

    for (let pathPart of pathSegments) {
      let startPrice =
        this.citiesData[pathPart.startCityName][pathPart.bestProductName] || 0;

      let destinationPrice =
        this.citiesData[pathPart.destinationCityName][
          pathPart.bestProductName
        ] || 0;

      rows.push(
        "\t" +
          "Buy product <" +
          pathPart.bestProductName +
          "> at price " +
          startPrice +
          " in the city " +
          pathPart.startCityName +
          " and sell at price " +
          destinationPrice +
          " in the city " +
          pathPart.destinationCityName +
          ". Budget is " +
          pathPart.getBestResultingBudget()
      );
    }

    rows.push("Total trip profit is " + path.getPathProfit());

    console.log(rows.join("\r\n"));
  }
}

/**

* Class represents segment of the path between two cities.

* Designed to find and store data about the best possible deal between given cities.

*/

class PathSegment {
  constructor(startCityName, destinationCityName, cities_data) {
    this.startCityProducts = cities_data[startCityName];

    this.destinationCityProducts = cities_data[destinationCityName];

    this.startCityName = startCityName;

    this.destinationCityName = destinationCityName;

    this.bestProductName = null;

    this.resultingBudget = null;
  }

  calculateForBudget(budget) {
    let startCityProducts = this.startCityProducts;

    let destinationCityProducts = this.destinationCityProducts;

    let bestProfit = 0;

    let bestProductName = "";

    for (let productName in startCityProducts) {
      if (startCityProducts[productName] > budget) {
        continue;
      }

      let current_produc_profit =
        destinationCityProducts[productName] - startCityProducts[productName];

      if (current_produc_profit > bestProfit) {
        bestProfit = destinationCityProducts[productName];

        bestProductName = productName;
      }
    }

    if (!bestProfit) {
      // no profitable products

      this.resultingBudget = budget;

      this.bestProductName = "any product";
    } else {
      // sales revenue + (budget - purchase price)

      this.resultingBudget =
        bestProfit + (budget - startCityProducts[bestProductName]);

      this.bestProductName = bestProductName;
    }
  }

  getBestResultingBudget() {
    if (this.resultingBudget == null) {
      throw new Error(
        'Values was not calculated. Invoke "calculateForBudget" method to resolve the value.'
      );
    }

    return this.resultingBudget;
  }

  getBestProduct() {
    if (this.bestProductName == null) {
      throw new Error(
        'Values was not calculated. Invoke "calculateForBudget" method to resolve the value.'
      );
    }

    return this.bestProductName;
  }
}

/**

* Сlass is for generation permutations without repetitions for items in given array

* Algorithm was developed by Narayana Pandita(1325–1400) and stolen from internet

*/

class Combinator {
  constructor(items) {
    this.items = items;

    this.p = [];

    this.used = [];

    this.results = [];
  }

  antylex(pos) {
    let n = this.items.length;

    if (pos == -1) {
      let set = [];

      for (let i = 0; i < n; i++) {
        set.push(this.items[this.p[i]]);
      }

      this.results.push(set);

      return;
    }

    for (let i = n - 1; i >= 0; i--) {
      if (!this.used[i]) {
        this.used[i] = true;

        this.p[pos] = i;

        this.antylex(pos - 1);

        this.used[i] = false;
      }
    }
  }

  generateCombos() {
    this.items.length;

    this.antylex(this.items.length - 1);

    return this.results;
  }
}

// ------------------------------------------------

let app = new Trip(CITIES_DATA, INITIAL_BUDGET);

let path = app.findPath();

path.printDetails();
