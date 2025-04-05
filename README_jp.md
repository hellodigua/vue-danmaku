# vue-danmaku

[![npm-version](https://img.shields.io/npm/v/vue-danmaku.svg)](https://www.npmjs.com/package/vue-danmaku)
![npm download](https://img.shields.io/npm/dm/vue-danmaku)
[![size](https://img.shields.io/badge/minifiedsize-15kB-blue.svg)](https://www.npmjs.com/package/vue-danmaku)
[![license](https://img.shields.io/npm/l/express.svg)]()

> Vue.js ベースの弾幕（コメント）インタラクションコンポーネント

日本語 | [English](https://github.com/hellodigua/vue-danmaku/blob/vue2/README_en.md) | [简体中文](https://github.com/hellodigua/vue-danmaku/blob/vue2/README.md)

デモ： [https://hellodigua.github.io/vue-danmaku](https://hellodigua.github.io/vue-danmaku)

ライブデモ： [https://jsfiddle.net/hellodigua/j78h6429/99/](https://jsfiddle.net/hellodigua/j78h6429/99/)

Vue3 もサポートしています：[vue-danmaku](https://github.com/hellodigua/vue-danmaku)

**バージョン情報**: vue-danmaku@1.7.x は Vue 2 をサポートする最後のバージョンです。v2.0.0 以降は Vue 3 以上のバージョンのみをサポートします。

## プレビュー

![preview](https://cdn.jsdelivr.net/gh/hellodigua/cdn/img/vue-danmaku.webp)

## インストール

Vue2 バージョンをインストール

```bash
$ npm install vue-danmaku@1 --save
```

## 使い方

```vue
<template>
  <div>
    <vue-danmaku v-model="danmus" style="height:100px; width:300px;"></vue-danmaku>
  </div>
</template>

<script>
import vueDanmaku from 'vue-danmaku'

export default {
  components: {
    vueDanmaku,
  },
  data() {
    return {
      danmus: ['danmu1', 'danmu2', 'danmu3', '...'],
    }
  },
}
</script>
```

## 属性

| パラメータ    | 説明                                                                 | タイプ  | 選択可能な値             | デフォルト値 |
| :------------ | :------------------------------------------------------------------- | :------ | :----------------------- | :----------- |
| v-model       | 弾幕要素リスト、プレーンテキストまたはカスタムオブジェクトをサポート | Array   | 文字列またはオブジェクト | []           |
| channels      | トラック数                                                           | Number  |                          | 0            |
| autoplay      | 自動再生するかどうか                                                 | Boolean |                          | true         |
| useSlot       | 弾幕スロットを有効にするかどうか                                     | Boolean |                          | false        |
| loop          | 弾幕ループを有効にするかどうか                                       | Boolean |                          | false        |
| fontSize      | 弾幕フォントサイズ（スロットモードでは使用不可）                     | Number  |                          | 18           |
| extraStyle    | 追加スタイル（スロットモードでは使用不可）                           | String  |                          |              |
| speeds        | 弾幕の速度（1 秒あたりのピクセル数）                                 | Number  |                          | 200          |
| debounce      | 弾幕更新頻度（ms）                                                   | Number  |                          | 100          |
| randomChannel | ランダムトラックに挿入するかどうか                                   | Boolean |                          | false        |
| isSuspend     | マウスホバーで弾幕を一時停止するかどうか（実験的機能）               | Boolean |                          | false        |
| top           | 弾幕の垂直間隔（px）                                                 | Number  |                          | 4            |
| right         | 弾幕の水平間隔（px）                                                 | Number  |                          | 0            |

- 注 0：v-model は 1.5.0 バージョンからの新しい構文で、弾幕の双方向バインディングをサポートしています。古いバージョンの danmus パラメータも引き続きサポートされています
- 注 1：channels が 0 の場合、トラック数はコンテナが収容可能な最大トラック数になります
- 注 2：danmus が初期化後に空の場合、autoplay は無効になります。そのため、非同期でロードされる弾幕データの場合は、手動で `this.$refs[refName].play()` を呼び出して再生する必要があります
- 注 3：弾幕更新頻度は、一定の時間間隔で 1 つの弾幕を挿入する頻度です

## 内蔵メソッド

`this.$refs[refName]` を介して呼び出します

| メソッド名   | 説明                                                               | パラメータ                             |
| :----------- | :----------------------------------------------------------------- | :------------------------------------- |
| play         | 再生開始/続行                                                      | -                                      |
| pause        | 弾幕再生を一時停止                                                 | -                                      |
| stop         | 再生を停止し弾幕をクリア                                           | -                                      |
| show         | 弾幕表示                                                           | -                                      |
| hide         | 弾幕非表示                                                         | -                                      |
| reset        | 設定をリセット                                                     | -                                      |
| resize       | コンテナサイズ変更時にスクロール距離を再計算（手動呼び出しが必要） | -                                      |
| push         | 弾幕を送信（弾幕リストの末尾に挿入、順番に表示）                   | danmu データ、文字列またはオブジェクト |
| add          | 弾幕を送信（現在の再生位置に挿入、リアルタイム表示）               | danmu データ、文字列またはオブジェクト |
| insert       | 弾幕を描画（リアルタイム挿入、データバインディングなし）           | danmu データ、文字列またはオブジェクト |
| getPlayState | 現在の再生状態を取得                                               |                                        |

- 注 1：push と add の戻り値は挿入後のインデックスで、このインデックスで現在挿入された弾幕のスタイルをカスタマイズできます
- 注 2：insert と push/add の違いは、insert はデータバインディングを行わず、直接 DOM に挿入するため、ライブ配信などのシーンに適しています

## イベント

| イベント名 | 説明                                           | 戻り値                            |
| :--------- | :--------------------------------------------- | :-------------------------------- |
| list-end   | すべての弾幕の挿入が完了                       | -                                 |
| play-end   | すべての弾幕の再生が完了（画面外にスクロール） | index（最後の弾幕のインデックス） |

## スロット

弾幕の構造とスタイルをカスタマイズする必要がある場合は、任意の構造のオブジェクトを渡して内部スタイルを自分で記述できます。

```vue
<template>
  <vue-danmaku ref="danmaku" v-model="danmus" use-slot loop :speeds="200" :channels="5">
    <!-- 弾幕スロット（vue 2.6.0以上のバージョンでは v-slot:dm="{ index, danmu }" 構文が使用可能） -->
    <template slot="dm" slot-scope="{ index, danmu }">
      <div>{{ index }}{{ danmu.name }}：{{ danmu.text }}</div>
    </template>
    <!-- コンテナスロット -->
    <div></div>
  </vue-danmaku>
</template>

<script>
import vueDanmaku from 'vue-danmaku'

export default {
  data() {
    return {
      danmus: [{ avatar: 'http://a.com/a.jpg', name: 'a', text: 'aaa' }, { avatar: 'http://a.com/b.jpg', name: 'b', text: 'bbb' }, ...]
    }
  }
}
</script>
```

## ディスカッションとバグ報告

この [QA ドキュメント](https://github.com/hellodigua/vue-danmaku/blob/vue2/QA.md) には、よくある質問が収集されています。参考にしてください。

また、このプロジェクトに [issue を提出](https://github.com/hellodigua/vue-danmaku/issues) することもできます。

## 注意事項

- vue-danmaku コンポーネントに幅と高さを設定する必要があります

## 変更履歴

### v1.7.3

- ロジックの最適化

### v1.7.2

- ドキュメントの更新

### v1.7.0

- resize ロジックの最適化
- fix: iOS15 の一部機種のアプリ内蔵 webview で弾幕初期化時に画面がちらつく可能性があるバグを修正

### v1.6.0

- feat: insert メソッドを公開し、外部から直接弾幕を描画可能に

### v1.5.0

- feat: v-model で弾幕の双方向バインディングをサポート

### v1.4.3

- feat: push と add メソッドが挿入インデックスを返すようにサポート

### v1.4.2

- fix: isSuspend 有効時にスロットル関数がホバー停止を無効にするバグを修正

### v1.4.1

- feat: 新パラメータ isSuspend (デフォルト false) を追加、マウスが弾幕上にホバーすると一時停止する機能をサポート
- fix: iOS15 の一部機種で画面がちらつく可能性があるバグを修正

### v1.4.0

- feat: ループモードでは、同じ画面に同じ弾幕が表示されないよう改善
- feat: デフォルト色をグレーに変更

### v1.3.2

- fix: 弾幕再生完了後に add を呼び出しても正常に再生されないバグを修正

### v1.3.0

- feat: setChannels を削除し、直接制御に変更
- feat: 弾幕挿入完了イベントと再生完了イベントを追加
- feat: 弾幕データが上書きされる場合に対応
- fix: 弾幕トラック数の計算が不正確な問題を修正
- fix: 初回更新時の弾幕速度が無効になる問題を修正

### v1.2.1

- fix: 初期化時に弾幕コンテナの幅が誤って計算される可能性があるバグを修正

### v1.2.0

- speed パラメータを speeds パラメータに変更し、意味も変更（主に異なる画面で弾幕の移動速度を同じにするため）
  - speed: 弾幕が画面を通過する総時間
  - speeds: 弾幕が 1 秒間に移動するピクセル距離

### v1.1.1

- 通常の弾幕のスタイルを制御できる extraStyle を追加

### v1.1.0

- 弾幕挿入メソッドを追加

### v1.0.5

- fix: iOS でのトランスレーションのちらつきの問題を修正

### v1.0.3

- fix: デフォルトスロット使用時のエラーを修正

### v1.0.0

将来のバージョンの使いやすさのために、コンポーネントパラメータを直接渡すように変更。以前のバージョンのドキュメントは[こちらをクリック](https://www.npmjs.com/package/vue-danmaku/v/0.3.6)

- コンポーネントパラメータを直接渡すように変更
- 一部コードのリファクタリング

### v0.3.6

- 非同期弾幕読み込みをサポート（注：非同期読み込み後は手動で play メソッドを呼び出す必要があります）

### v0.3.4

- ランダムトラックでの弾幕送信をサポート
- fix: 非ループモードでは、再生完了時に弾幕タスクを終了しないように修正

### v0.3.2

- 自動再生をサポート
- 弾幕コンテナのサイズ変更時にスクロール距離を再計算

### v0.3.1

- パッケージサイズの最適化

### v0.3.0

Make Core Code Great Again

- 弾幕間の距離設定をサポート
- 弾幕更新頻度の設定をサポート

### v0.2.0

- 弾幕スロットと対応するスタイル最適化をサポート

### v0.1.1

- fix: 0.1.0 のパッケージングエラーによるダウンロード不可の問題を修正

### v0.1.0

- モバイル再生をサポート

### v0.0.6

- 弾幕速度をサポート
- 弾幕フォントサイズをサポート
- 新規弾幕追加をサポート

### v0.0.5

- 弾幕一時停止をサポート
- トラック数制御をサポート
- 弾幕ループをサポート

### v0.0.1

- 2018.3.11: MVP バージョンをリリース
- 弾幕効果をサポート

## ライセンス

MIT
