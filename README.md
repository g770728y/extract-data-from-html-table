创建`utils型`工具方法库的`starter`, 既可以用于`yarn-workspace`, 也可以`npm publish`

```
git clone https://github.com/g770728y/create-utils-library.git <your-project-name>
vi ./package.json  <== 修改package.json中的project信息
yarn
**注意:**  `src/index`是你真正要导出为library的代码, 供其它库引用
**发布**: npm publish
```

---

## 特性

- 基于`typescript`, 生成`es5`目标文件
- 支持`jest`, 直接在`src`目录下`*.test.ts`, 然后 `yarn test`

---

## 何时使用

- 你希望创建一个**可重用的**工具方法库(我们通常叫`utils`)
- 希望使用`typescript`
- 这个库通常可同时供`node`端与`browser`端使用
- 也许你还希望发布到`npm`

---

## 如何使用

### `git clone https://github.com/g770728y/create-utils-library.git <your-project-name>`

```
vi ./package.json  <== 修改package.json中的project信息
yarn
```

### `yarn start`

以`watch`模式动态构建

### `yarn test`

以`watch`模式动态测试

### `yarn build`

### `npm publish`
