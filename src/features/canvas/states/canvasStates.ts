import { types } from "mobx-state-tree"

import { Point } from "~/features/KDTree/kdtree"

const CanvasModel = types
  .model({
    points: types.frozen(),
    size: types.array(types.number),
  })
  .actions((self) => ({
    setPoints(points: Point[]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
      self.points = points
      // self.points = points as any
    },
  }))

export const canvasStates = CanvasModel.create({
  points: [],
  size: [200, 200],
})
import { injectStores } from "@mobx-devtools/tools"

export const rootStates = {
  canvasStates,
} as const

injectStores(rootStates)
