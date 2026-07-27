import { GLOBE_HTML } from "./globe-markup";

/** The single continuous 300vh wireframe globe field + side rule, fixed under the
 *  text. Panned by scroll via CSS (see .fg in site.css); colour adapts per screen. */
export function Globe() {
  return <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: GLOBE_HTML }} />;
}
