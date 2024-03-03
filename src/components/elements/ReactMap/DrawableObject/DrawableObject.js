export class DrawableObject {
  draw(context, map) {}

  over(map, x, y) {
    return false;
  }

  pan(map, offsetX, offsetY) {}
}
