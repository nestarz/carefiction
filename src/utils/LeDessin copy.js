const namespace = "http://www.w3.org/2000/svg";

class LeDessin extends HTMLElement {
  static getProj(svg, path, x, y) {
    const CTM = path.getScreenCTM();
    const point = Object.assign(svg.createSVGPoint(), { x, y });
    return point.matrixTransform(CTM.inverse());
  }

  static getPath(points, command = (point) => `L ${point[0]} ${point[1]}`) {
    return points.reduce(
      (acc, point, i, a) =>
        i === 0
          ? `M ${point[0]},${point[1]}`
          : `${acc} ${command(point, i, a)}`,
      ""
    );
  }

  constructor() {
    super();
    this.recording = false;
    this.svg = document.createElementNS(namespace, "svg");
    this.path = document.createElementNS(namespace, "path");
    this.points = [];

    this.svg.setAttribute("height", "100%");
    this.svg.setAttribute("width", "100%");

    this.svg.addEventListener("click", (e) => this.onClick(e));
    this.svg.addEventListener("mousemove", (e) => this.onMove(e));
    this.svg.addEventListener("touchstart", (e) => this.onClick(e));
    this.svg.addEventListener("touchend", (e) => this.onClick(e));
    this.svg.addEventListener("touchmove", (e) => this.onMove(e.touches[0]));

    this.svg.appendChild(this.path);
    this.appendChild(this.svg);
  }

  onMove(e) {
    if (!this.recording) return;
    const { x, y } = LeDessin.getProj(this.svg, this.path, e.pageX, e.pageY);
    this.points = [...this.points, [x, y]];
    this.path.setAttribute("d", LeDessin.getPath(this.points));
  }

  onClick(e) {
    this.recording = !this.recording;
  }

  static get observedAttributes() {
    return ["stroke", "fill"];
  }

  attributeChangedCallback(name, _, newValue) {
    this.path.setAttribute(name, newValue);
  }
}

customElements.define("le-dessin", LeDessin);
