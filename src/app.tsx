import { randomUniform } from "d3"
import { observer } from "mobx-react"
import React, { useState } from "react"
import { HTMLAttributes } from "react"
import ReactDOM from "react-dom"
import styled from "styled-components"

import { KDTree, Point } from "~/features/KDTree/kdtree"

import { ButtonS } from "./common/style"
import { Canvas } from "./features/canvas/Canvas"
import { canvasStates } from "./features/canvas/states/canvasStates"
export type Rest = HTMLAttributes<HTMLDivElement>

const AppContainer = styled.div`
  display: grid;
  width: 100%;
  max-width: 700px;
  grid-template-areas:
    "title title"
    "operations lists"
    "canvas lists";
`

export const ListContainer = styled.div`
  width: 100%;
  max-height: 300px;
  overflow: auto;
`

export const List = ({ list }: { list: Point[] }) => {
  return (
    <ListContainer>
      {list.map((listItem) => {
        const text = listItem.map((i) => i.toFixed(2)).join(",")
        return <div key={text}>{text}</div>
      })}
    </ListContainer>
  )
}

const App = observer(function App() {
  const points = canvasStates.points as unknown as Point[]

  const [w, setW] = useState(100)
  const [h, setH] = useState(100)
  const [maxR, setMaxR] = useState(10)

  const [pointCount, setPointCount] = useState(20)
  const [tree, setTree] = useState<KDTree>()

  return (
    <AppContainer>
      <div
        style={{
          gridArea: "title",
        }}
      >
        <a href="https://gist.github.com/MXXXXXS/ccff3f159773d958442c39378c614309">
          Kd tree nearest neighbor search
        </a>
      </div>
      <div
        style={{
          gridArea: "operations",
        }}
      >
        <div>
          点数量:
          <input
            type={"number"}
            value={pointCount}
            onChange={(v) => {
              setPointCount(parseInt(v.currentTarget.value))
            }}
          ></input>
          点之间最小距离:
          <input
            type={"number"}
            value={maxR}
            onChange={(v) => {
              setMaxR(parseFloat(v.currentTarget.value))
            }}
          ></input>
          <ButtonS
            style={{
              border: "1px solid rgb(149,180,54)",
              width: "max-content",
            }}
            onClick={() => {
              const tree = new KDTree()
              if (tree) {
                for (let index = 0; index < pointCount; index++) {
                  const point: Point = [
                    randomUniform(0, w)(),
                    randomUniform(0, h)(),
                  ]
                  const nearest = tree.findNearestNeighbor(point)
                  if (
                    nearest === null ||
                    KDTree.distance(nearest, point) >= maxR
                  ) {
                    tree.insert(point)
                  }
                }
              }
              const treePoints: Point[] = []
              tree.getPoints(treePoints, tree.root!)
              canvasStates.setPoints(treePoints)
              setTree(tree)
            }}
          >
            添加{pointCount}个点
          </ButtonS>
        </div>
      </div>
      <div
        className="list"
        style={{
          gridArea: "lists",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <List list={points}></List>
      </div>
      <Canvas
        style={{
          gridArea: "canvas",
        }}
      ></Canvas>
    </AppContainer>
  )
})

ReactDOM.render(<App></App>, document.body.querySelector("#root"))
