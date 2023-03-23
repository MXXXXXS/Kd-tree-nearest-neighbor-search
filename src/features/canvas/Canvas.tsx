import * as d3 from "d3"
import { observer } from "mobx-react-lite"
import { useEffect, useRef } from "react"
import styled from "styled-components"

import { Rest } from "~/app"
import { Point } from "~/features/KDTree/kdtree"

import { canvasStates } from "./states/canvasStates"

function plot({
  points,
  xMax = 100,
  yMax = 100,
  width = 200,
  height = 200,
}: {
  points: Point[]
  xMax?: number
  yMax?: number
  width?: number
  height?: number
}) {
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height])

  const scaleX = d3.scaleLinear().domain([0, xMax]).range([0, width])
  const scaleY = d3.scaleLinear().domain([0, yMax]).range([0, height])

  const g1 = svg.append("g")

  g1.selectAll("circle")
    .data(points)
    .join("circle")
    .attr("cx", (d: Point) => scaleX(d[0]))
    .attr("cy", (d: Point) => scaleY(d[1]))
    .attr("r", 2)
    .style("fill", "gray")

  return svg
}

const CanvasContainer = styled.div`
  margin: 10px;
  border: 1px solid orangered;
  width: 200px;
  height: 200px;
`

export const Canvas = observer(({ ...rest }: Rest) => {
  const canvasElRef = useRef<HTMLDivElement>(null)
  const { points, size } = canvasStates

  useEffect(() => {
    const node = plot({
      points: points as unknown as Point[],
      width: size[0],
      height: size[1],
    }).node()
    const canvasEl = canvasElRef.current
    if (canvasEl && node) {
      canvasEl.innerHTML = ""
      canvasEl.append(node)
    }
  }, [points, size])
  return <CanvasContainer {...rest} ref={canvasElRef}></CanvasContainer>
})
