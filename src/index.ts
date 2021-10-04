export function extractArrayFromTable(
  htmlStr: string
): { value: any; rowspan: number; colspan: number }[][] {
  if (htmlStr.length < 10) return [];

  if (htmlStr.toLowerCase().indexOf("<table") <= 0) return [];

  const div = document.createElement("div");
  div.innerHTML = htmlStr;

  if (div.children.length <= 0) {
    return [];
  }

  // return _getArrayFromTable(div.children[0], []);
  const rawArray = _getArrayFromTable(div.children[0], []);
  return rawArray.length > 0 ? normalizedArray(rawArray) : rawArray;
}

export interface RawCell {
  value: any;
  rowspan: number;
  colspan: number;
}

function _getArrayFromTable(dom: Element, _array: any[][]): RawCell[][] {
  const row: RawCell[] = [];
  for (let i = 0; i < dom.children.length; i++) {
    const child = dom.children[i];
    if (["th", "td"].indexOf(child.tagName.toLowerCase()) >= 0) {
      row.push({
        value: child.textContent,
        rowspan: parseInt(child.getAttribute("rowspan") || "1"),
        colspan: parseInt(child.getAttribute("colspan") || "1"),
      });
    } else if (child.children.length > 0) {
      _getArrayFromTable(child, _array);
    }
  }
  _array.push(row);

  return _array.filter((it) => it.length > 0);
}

export function normalizedArray(
  rawMatrix: RawCell[][]
): { value: any; rowspan: number; colspan: number }[][] {
  // 以第一行的列数为准，超出则裁剪
  const colLen = rawMatrix[0].reduce(
    (acc, cell) => acc + (cell.colspan ?? 1),
    0
  );

  // 补全rawArray长度，因rowSpan的存在
  let _rawMatrix: any[][] = fillMatrixGap(rawMatrix, colLen);

  // 原理： 先构造一个新二维数组，全填0
  // 此数组长度可能不正确， 因为rawArray可能缺少整行(rowspan)
  const newArray: any[][] = [];
  for (let i = 0; i < _rawMatrix.length; i++) {
    const row = [];
    for (let j = 0; j < colLen; j++) {
      row.push(undefined);
    }
    newArray.push(row);
  }

  // 因为数组长度相等了，所以接下来就好填写了
  for (let i = 0, rowLen = _rawMatrix.length; i < rowLen; i++) {
    const row = _rawMatrix[i];

    for (let j = 0; j < Math.min(colLen, row?.length ?? 0); j++) {
      if (row[j] !== undefined) {
        const { value, rowspan = 1, colspan = 1 } = row[j];
        const __j = newArray[i].findIndex((it) => it === undefined);
        for (let rowIndex = i; rowIndex < i + rowspan; rowIndex++) {
          const _j = newArray[rowIndex].findIndex((it) => it === undefined);
          for (let colIndex = _j; colIndex < _j + colspan; colIndex++) {
            newArray[rowIndex][colIndex] = null;
          }
        }
        newArray[i][__j] = row[j];
      }
    }
  }

  return newArray;
}

export function fillMatrixGap(rawMatrix: RawCell[][], colLen: number) {
  let newMatrix: any[][] = [];
  for (let i = rawMatrix.length - 1; i >= 0; i--) {
    if (
      rawMatrix[i][0] &&
      rawMatrix[i][0].colspan >= colLen &&
      (rawMatrix[i][0].rowspan ?? 1) > 1
    ) {
      // 行内第1个单元格，如果colspan跨所有列，并且存在rowspan，则插入空行
      newMatrix = [
        rawMatrix[i],
        ...new Array(rawMatrix[i][0].rowspan - 1).fill([]),
        ...newMatrix,
      ];
    } else {
      newMatrix = [rawMatrix[i], ...newMatrix];
    }
  }
  return newMatrix;
}
