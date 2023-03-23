export type Point = [x: number, y: number]

class KDTreeNode {
  left: KDTreeNode | null = null
  right: KDTreeNode | null = null
  constructor(public point: Point, public depth: number) {}
}

export class KDTree {
  root: KDTreeNode | null = null

  private insertNode(
    node: KDTreeNode | null,
    point: Point,
    depth = 0
  ): KDTreeNode {
    if (node === null) {
      return new KDTreeNode(point, depth)
    }

    const dimension = node.depth % 2

    if (point[dimension] < node.point[dimension]) {
      node.left = this.insertNode(node.left, point, depth + 1)
    } else {
      node.right = this.insertNode(node.right, point, depth + 1)
    }

    return node
  }

  insert(point: Point): void {
    this.root = this.insertNode(this.root, point)
  }

  getPoints(points: Point[], node: KDTreeNode) {
    points.push(node.point)
    if (node.left != null) {
      this.getPoints(points, node.left)
    }
    if (node.right != null) {
      this.getPoints(points, node.right)
    }
  }

  private findNearestNode(
    node: KDTreeNode | null,
    point: Point,
    best: KDTreeNode | null
  ): KDTreeNode | null {
    if (node === null) {
      return best
    }

    const nodeDistance = KDTree.distance(node.point, point)
    const bestDistance = best ? KDTree.distance(best.point, point) : Infinity

    if (nodeDistance < bestDistance) {
      best = node
    }

    const dimension = node.depth % 2

    if (point[dimension] < node.point[dimension]) {
      best = this.findNearestNode(node.left, point, best)
      if (
        node.right !== null &&
        KDTree.distance(point, best?.point || [Infinity, Infinity]) >
          Math.abs(node.point[dimension] - point[dimension])
      ) {
        best = this.findNearestNode(node.right, point, best)
      }
    } else {
      best = this.findNearestNode(node.right, point, best)
      if (
        node.left !== null &&
        KDTree.distance(point, best?.point || [Infinity, Infinity]) >
          Math.abs(node.point[dimension] - point[dimension])
      ) {
        best = this.findNearestNode(node.left, point, best)
      }
    }

    return best
  }

  findNearestNeighbor(point: Point): Point | null {
    const nearestNode = this.findNearestNode(this.root, point, null)
    return nearestNode ? nearestNode.point : null
  }

  static distance(p1: Point, p2: Point): number {
    const dx = p1[0] - p2[0]
    const dy = p1[1] - p2[1]
    return Math.sqrt(dx * dx + dy * dy)
  }
}
