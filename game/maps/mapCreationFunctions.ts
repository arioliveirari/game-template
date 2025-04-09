import { ObjetsConfig, BuildingConfig, sideWalkConfig, streetConfig } from "./mapTypes";

export const createBase = (n: number, playerPos: number[] = [0, 0]): string => {
  let _mn: number[][] = new Array(n).fill(new Array(n).fill(0));
  _mn = _mn.map((row, i) => row.map((_, j) => Number(0)));

  //@ts-ignore
  _mn[playerPos[0]][playerPos[1]] = "PS";

  const builded = _mn.map((row) => row.join(" ")).join("\n");
  return builded;
};

export type spawnItemType = {
  matrixRow: number
  matrixCol: number
  objectNumber: number
}

export type formQuestionType = {
  question: string,
  type: string,
  imageForm: string,
  correctResponse: string,
  wrongResponse: string,
  answers: {
    text: string,
    isCorrect: boolean
  }[]
}


export type configMinigame = {
  type: "PUSH_OBJECT" | "FIND_OBJECT"  | "FIND_BUILDING"
  items: spawnItemType[]
} | {
  type: "COMPLETE_FORM"
  items: formQuestionType[]
} | {
  type: "MINIGAME_SCENE"
  items: number[]
}

export type configMinigamePushFind = {
  id: number
  items: spawnItemType[]
}

export const createMinigame = (n: number, config: configMinigamePushFind[]): string => {
  let _mn: number[][] = new Array(n).fill(new Array(n).fill(0));
  _mn = _mn.map((row, i) => row.map((_, j) => Number(0)));
  let builded = ""
  config.forEach((configItem) => {
    for (let i = 0; i < configItem.items.length; i++) {
      _mn[configItem.items[i].matrixCol][configItem.items[i].matrixRow] = configItem.items[i].objectNumber;
    }
  })
  builded = _mn.map((row) => row.join(" ")).join("\n");
  return builded;
};

export const createGrass = (
  n: number,
  withParser: boolean = true,
  buildings: BuildingConfig[] = [],
  baseNumber: number = 1
): string | number[][] => {
  let _mn: number[][] = new Array(n).fill(new Array(n).fill(baseNumber));
  _mn = _mn.map((row, i) => row.map((_, j) => Number(baseNumber)));

  // iterate buildings and add 134 tile around the building

  for (let i = 0; i < buildings.length; i++) {
    const { x, y, w, h, z } = buildings[i];
    for (let j = 0; j < z; j++) {
      for (let k = 0; k < w; k++) {
        if (x + k + 1 < n) {
          _mn[x + k + 1][y + j] = 134;
        }
        if (x + k - 1 >= 0) {
          _mn[x + k - 1][y + j] = 134;
        }
        if (y + j + 1 < n) {
          _mn[x + k][y + j + 1] = 134;
        }
        if (y + j - 1 >= 0) {
          _mn[x + k][y + j - 1] = 134;
        }
        if (x + k + 1 < n && y + j + 1 < n) {
          _mn[x + k + 1][y + j + 1] = 134;
        }
        if (x + k + 1 < n && y + j - 1 >= 0) {
          _mn[x + k + 1][y + j - 1] = 134;
        }
        if (x + k - 1 >= 0 && y + j + 1 < n) {
          _mn[x + k - 1][y + j + 1] = 134;
        }
        if (x + k - 1 >= 0 && y + j - 1 >= 0) {
          _mn[x + k - 1][y + j - 1] = 134;
        }
      }
    }
  }






  const builded = _mn;
  return !withParser ? builded : builded.map((row) => row.join(" ")).join("\n");
};

export const addItems = (base: number[][], objets: ObjetsConfig[]) => {
  for (let i = 0; i < objets.length; i++) {
    const { x, y, type } = objets[i];
    // @ts-ignore
    base[x][y] = type;
  }

  return base;
};

export const createBullets = (
  base: number[][],
  withParser: boolean = true
): string | number[][] => {
  return !withParser ? base : base.map((row) => row.join(" ")).join("\n");
};

export const createSideWalk = (
  base: number[][] | string,
  sideWalkConfig: sideWalkConfig,
  withParser: boolean = true
): string | number[][] => {
  if (typeof base === "string") {
    return base;
  }
  let newXPos = sideWalkConfig.xPos
    .map((x: number) => {
      // return array of streetWidth items with x+1, x+2...
      const street = new Array(1)
        .fill(0)
        .map((_, i) => x + i);
      return street;
    })
    .flat();
  let newYPos = sideWalkConfig.yPos
    .map((y: number) => {
      // return array of streetWidth items with x+1, x+2...
      const street = new Array(1)
        .fill(0)
        .map((_, i) => y + i);
      return street;
    })
    .flat();
  // delete duplicated items in the arrays
  newXPos = newXPos.filter((item, index) => newXPos.indexOf(item) === index);
  newYPos = newYPos.filter((item, index) => newYPos.indexOf(item) === index);

  const builded = base.map((row, i) => {
    //go through sideWalkConfig and if i is equal to any xPos return all 3
    if (newXPos.includes(i)) {
      return row.map((_, j) => {
        return _ == 1 ? 133 : _;
      });
    } else {
      // map row and if j is equal to any yPos return 10
      return row.map((_, j) => {
        if (newYPos.includes(j)) {
          return _ == 1 ? 133 : _;
        }
        return _;
      });
    }
  });
  return !withParser ? builded : builded.map((row) => row.join(" ")).join("\n");

}


export const createStreets = (
  base: number[][] | string,
  streetConfig: streetConfig,
  withParser: boolean = true
): string | number[][] => {
  if (typeof base === "string") {
    return base;
  }
  // This logic is good but we want to change it a little bit.
  // It requires to detect de streetWith. The logic is different if the with is odd or even

  let newXPos = streetConfig.xPos
    .map((x: number) => {
      // return array of streetWidth items with x+1, x+2...
      const street = new Array(streetConfig.streetWidth)
        .fill(0)
        .map((_, i) => x + i);
      return street;
    })
    .flat();
  let newYPos = streetConfig.yPos
    .map((y: number) => {
      // return array of streetWidth items with x+1, x+2...
      const street = new Array(streetConfig.streetWidth)
        .fill(0)
        .map((_, i) => y + i);
      return street;
    })
    .flat();
  // delete duplicated items in the arrays
  newXPos = newXPos.filter((item, index) => newXPos.indexOf(item) === index);
  newYPos = newYPos.filter((item, index) => newYPos.indexOf(item) === index);

  const builded = base.map((row, i) => {
    //go through streetConfig and if i is equal to any xPos return all 3
    if (newXPos.includes(i)) {
      return row.map((_, j) => {
        return 11;
      });
    } else {
      // map row and if j is equal to any yPos return 10
      return row.map((_, j) => {
        if (newYPos.includes(j)) {
          return 10;
        }
        return _
      });
    }
  });

  // now we need to change all vertical streets to number 10, all horizontal streets to number 11 and all possible intersections to number 12

  // first we need to find all intersections
  let xIntersections = [];
  let yIntersections = [];

  let xPosStreets =
    typeof streetConfig.xPos == "number"
      ? [streetConfig.xPos]
      : streetConfig.xPos;
  let yPosStreets =
    typeof streetConfig.yPos == "number"
      ? [streetConfig.yPos]
      : streetConfig.yPos;
  let maxMapSize = builded.length;


  // check the width of the street and add subadditionals streets

  let toAddOnX = [];
  let toAddOnY = [];

  for (let j = 0; j < xPosStreets.length; j++) {
    let streetSizeW = 0 
    if(typeof streetConfig.streetWidth === "number") {
      streetSizeW = streetConfig.streetWidth;
    } else {
      streetSizeW = streetConfig.streetWidth[j];
    }
    for (let i = 0; i < streetSizeW; i++) {
      toAddOnX.push(xPosStreets[j] + i);
    }
  }

  for (let j = 0; j < yPosStreets.length; j++) {
    let streetSizeH = 0 
    if(typeof streetConfig.streetHeight === "number") {
      streetSizeH = streetConfig.streetHeight;
    } else {
      streetSizeH = streetConfig.streetHeight[j];
    }
    for (let i = 0; i < streetSizeH; i++) {
      toAddOnY.push(yPosStreets[j] + i);
    }
  }

  xPosStreets = xPosStreets.concat(toAddOnX);
  yPosStreets = yPosStreets.concat(toAddOnY);

  // remove duplicates
  xPosStreets = xPosStreets.filter(
    (item, index) => xPosStreets.indexOf(item) === index
  );

  yPosStreets = yPosStreets.filter(
    (item, index) => yPosStreets.indexOf(item) === index
  );

  // sort 

  xPosStreets = xPosStreets.sort((a, b) => a - b);
  yPosStreets = yPosStreets.sort((a, b) => a - b);

  let counterI = 0
  for (let i = 0; i < xPosStreets.length; i++) {
    if(counterI == 3) {
      counterI = 0
    }
    for (let j = 0; j < maxMapSize; j++) {
      if (xPosStreets[i] && builded[i][j]) {
        xIntersections.push([xPosStreets[i], j]);
        if (counterI % 2 === 0) builded[xPosStreets[i]][j] = 111;
        else builded[xPosStreets[i]][j] = 136;
      }
    }
    counterI++;

  }

  for (let i = 0; i < yPosStreets.length; i++) {
    for (let j = 0; j < maxMapSize; j++) {
      if (yPosStreets[i] && builded[j][i]) {
        yIntersections.push([j, yPosStreets[i]]);
        
        if (i % 2 !== 0) builded[j][yPosStreets[i]] = 111;
        else builded[j][yPosStreets[i]] = 10;
      }
    }
  }

  let sideWalkCoordsX: any[] = []
  let sideWalkCoordsY: any[] = []
  let intersectionCoords: any[] = []
  for (let i = 0; i < xIntersections.length; i++) {
    for (let j = 0; j < yIntersections.length; j++) {
      if (
        xIntersections[i][0] === yIntersections[j][0] &&
        xIntersections[i][1] === yIntersections[j][1]
      ) {
        sideWalkCoordsX.push(xIntersections[i - 1]);
        sideWalkCoordsX.push(xIntersections[i + 1]);
        sideWalkCoordsY.push(yIntersections[j - 1]);
        sideWalkCoordsY.push(yIntersections[j + 1]);
        intersectionCoords.push(xIntersections[i]);
        builded[xIntersections[i][0]][xIntersections[i][1]] = 111;
      }
    }
  }


  function removeDuplicatePairs(matrix: any) {
    const uniquePairs = new Set(
      matrix.map((pair: number[] )=> JSON.stringify(pair)) // Convertimos cada par a string para usar Set
    );
    return Array.from(uniquePairs).map(pair => JSON.parse(pair as string)); // Reconstruimos la matriz original
  }

  sideWalkCoordsX = removeDuplicatePairs([...sideWalkCoordsX])
  sideWalkCoordsY = removeDuplicatePairs([...sideWalkCoordsY])
  intersectionCoords = removeDuplicatePairs([...intersectionCoords])

  // remove all items from sideWaalkCoords that are in intersectionCoords
  sideWalkCoordsX = sideWalkCoordsX.filter((item) => {
    return !intersectionCoords.some((item2) => {
      return item[0] === item2[0] && item[1] === item2[1]
    })
  })
  sideWalkCoordsY = sideWalkCoordsY.filter((item) => {
    return !intersectionCoords.some((item2) => {
      return item[0] === item2[0] && item[1] === item2[1]
    })
  })

  for (let i = 0; i < sideWalkCoordsX.length; i++) {
    builded[sideWalkCoordsX[i][0]][sideWalkCoordsX[i][1]] = 138;
  }
  for (let i = 0; i < sideWalkCoordsY.length; i++) {
    builded[sideWalkCoordsY[i][0]][sideWalkCoordsY[i][1]] = 137;
  }

  return !withParser ? builded : builded.map((row) => row.join(" ")).join("\n");
};

export const generateBuildings = (n: number, buildings: BuildingConfig[]) => {
  if(buildings.length === 0) return [];
  let r = [];
  const generateLayer = () => {
    let _mn: number[][] = new Array(n).fill(new Array(n).fill(1));
    _mn = _mn.map((row, i) => row.map((_, j) => Number(0)));
    return _mn;
  };

  //grab highest building
  const largestBuilding = buildings.reduce((acc, building) => {
    if (building.h > acc.h) {
      return building;
    }
    return acc;
  });

  for (let i = 0; i < largestBuilding.h; i++) {
    let _mn = generateLayer();

    buildings.forEach((building) => {
      const { x, y, w, h, z, type, replace } = building;

      if (replace) {
        for (let j = 0; j < z; j++) {
          for (let k = 0; k < w; k++) {
            if (i >= h) {
              continue;
            } else {
              _mn[x + k][y + j] = replace[i] && replace[i][j] && replace[i][j][k] ? Number(replace[i][j][k]) : Number(type);

            }
          }
        }
      } else {
        for (let j = 0; j < z; j++) {
          for (let k = 0; k < w; k++) {
            if (i >= h) {
              continue;
            } else {
              _mn[x + k][y + j] = Number(type);
            }
          }
        }
      }
    });
    r.push(_mn);
  }

  return r;
};