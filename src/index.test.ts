import { extractArrayFromTable, normalizedArray, fillMatrixGap } from ".";

describe("extractArrayFromTable", () => {
  test("case0", () => {
    expect(extractArrayFromTable("")).toEqual([]);
    expect(extractArrayFromTable("<html></html>")).toEqual([]);
  });

  it("case1: 返回空表", () => {
    const result = [] as any;
    expect(extractArrayFromTable("<html><Table></table></html>")).toEqual(
      result
    );
  });

  it("case3:多行", () => {
    const result = [
      [{ value: "1", rowspan: 1, colspan: 1 }],
      [{ value: "1", rowspan: 1, colspan: 1 }],
    ];
    expect(
      extractArrayFromTable(
        "<html><table><tr><td>1</td></tr><tr><td>1</td></tr></table></html>"
      )
    ).toEqual(result);
  });

  it("case4:单行", () => {
    const result = [
      [
        { value: "111", rowspan: 1, colspan: 1 },
        { value: "111,111.11", rowspan: 1, colspan: 1 },
      ],
    ];
    expect(
      extractArrayFromTable(
        "<html><table><tr><td>111</td><td>111,111.11</td></tr></table></html>"
      )
    ).toEqual(result);
  });

  it("case5:with rowspan/colspan", () => {
    const result = [[{ value: "", rowspan: 2, colspan: 1 }]];
    expect(
      extractArrayFromTable(
        "<html><table><tr><td rowspan=2></td></tr></table></html>"
      )
    ).toEqual(result);
  });
});

describe("normalizedArray", () => {
  it("case0", () => {
    /**
     * 简图：
     * 1 0 1
     * 1 1 1
     * 0表示被合并
     */
    const params = [
      [
        {
          value: 1,
          rowspan: 1,
          colspan: 2,
        },
        {
          value: 2,
          rowspan: 1,
          colspan: 1,
        },
      ],
      [
        {
          value: 3,
          rowspan: 1,
          colspan: 1,
        },
        {
          value: 4,
          rowspan: 1,
          colspan: 1,
        },
        {
          value: 5,
          rowspan: 1,
          colspan: 1,
        },
      ],
    ];
    expect(normalizedArray(params)).toEqual([
      [
        {
          value: 1,
          rowspan: 1,
          colspan: 2,
        },
        null,
        {
          value: 2,
          rowspan: 1,
          colspan: 1,
        },
      ],
      [
        {
          value: 3,
          rowspan: 1,
          colspan: 1,
        },
        {
          value: 4,
          rowspan: 1,
          colspan: 1,
        },
        {
          value: 5,
          rowspan: 1,
          colspan: 1,
        },
      ],
    ]);
  });

  it("case1", () => {
    /**
     * 简图：
     * 1 1 1
     * 0 1 1
     * 0表示被合并
     */
    const params = [
      [
        {
          value: 1,
          rowspan: 2,
          colspan: 1,
        },
        {
          value: 2,
          rowspan: 1,
          colspan: 1,
        },
        {
          value: 3,
          rowspan: 1,
          colspan: 1,
        },
      ],
      [
        {
          value: 4,
          rowspan: 1,
          colspan: 1,
        },
        {
          value: 5,
          rowspan: 1,
          colspan: 1,
        },
      ],
    ];
    expect(normalizedArray(params)).toEqual([
      [
        {
          value: 1,
          rowspan: 2,
          colspan: 1,
        },
        {
          value: 2,
          rowspan: 1,
          colspan: 1,
        },
        {
          value: 3,
          rowspan: 1,
          colspan: 1,
        },
      ],
      [
        null,
        {
          value: 4,
          rowspan: 1,
          colspan: 1,
        },
        {
          value: 5,
          rowspan: 1,
          colspan: 1,
        },
      ],
    ]);
  });

  /**
   * 简图：
   * 1 0 0
   * 0 0 0
   * 1 1 1
   * 0表示被合并
   */
  it("case2", () => {
    const params = [
      [{ value: 1, rowspan: 2, colspan: 3 }],
      [{ value: 2 }, { value: 3 }, { value: 4 }],
    ];
    const expected = [
      [{ value: 1, rowspan: 2, colspan: 3 }, null, null],
      [null, null, null],
      [{ value: 2 }, { value: 3 }, { value: 4 }],
    ];
    expect(normalizedArray(params as any)).toEqual(expected);
  });

  /**
   * 简图：
   * 1 0 1
   * 0 0 1
   * 0 0 1
   * 0表示被合并
   */
  it("case3", () => {
    const params = [
      [{ value: 1, rowspan: 3, colspan: 2 }, { value: 2 }],
      [{ value: 3 }],
      [{ value: 4 }],
    ];
    const expected = [
      [{ value: 1, rowspan: 3, colspan: 2 }, null, { value: 2 }],
      [null, null, { value: 3 }],
      [null, null, { value: 4 }],
    ];
    expect(normalizedArray(params as any)).toEqual(expected);
  });
});

describe("fillMatrixGap", () => {
  it("case0", () => {
    /**
     * 简图：
     * 1 0 0
     * 0 0 0
     * 1 0 0
     * 0表示被合并
     */
    const params = [
      [
        {
          value: 1,
          rowspan: 2,
          colspan: 3,
        },
      ],
      [
        {
          value: 3,
          rowspan: 1,
          colspan: 3,
        },
      ],
    ];
    expect(fillMatrixGap(params, 3)).toEqual([
      [
        {
          value: 1,
          rowspan: 2,
          colspan: 3,
        },
      ],
      [],
      [
        {
          value: 3,
          rowspan: 1,
          colspan: 3,
        },
      ],
    ]);
  });
});
