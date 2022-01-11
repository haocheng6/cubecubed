import { svg } from "../cubicons/constants";

/**
 * The granddad/grandma object of everything in the visualization.
 * Scene() here is a must in every result math videos.
 *
 * Each scene must include at least one group.
 *
 * Please see the Quick Start page in official documentation for clearer understanding about this `Scene` term.
 */
export class Scene {
    /**
     * The `<svg/>` element that represents this scene.
     */
    svg_scene: any;

    /**
     * Name of this scene.
     */
    name: string;

    /**
     * Include this scene to HTML flow.
     *
     * @param sceneName Name of the scene.
     */
    constructor(sceneName: string) {
        this.svg_scene = !svg.select(`#${sceneName}`).empty()
            ? svg.select(`#${sceneName}`)
            : svg
                  .append("svg")
                  .attr("id", `${sceneName}`)
                  .attr("class", "scene");
        this.name = sceneName;
    }

    /**
     * Fade out and remove this scene away from HTML flow.
     * That means, everything in the scene will be removed, too.
     *
     * @param delay Delay (in milliseconds) before destroying this scene.
     * > This delay variable should be tracked by summing all Group().groupElapsed properties of all `Group()`s in this scene.
     */
    destroy(delay: number) {
        this.svg_scene
            .transition()
            .delay(delay)
            .duration(500)
            .style("opacity", 0)
            .remove();
    }
}
