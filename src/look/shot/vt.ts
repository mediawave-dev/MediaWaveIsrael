// shot · the shared paper between pages (cross-document view transitions, D91). The home page's
// service label and the service page's hero sheet carry one name, and so do the service's object
// on the desk and the service page's hero object: on a plain link the browser morphs one into the
// other. Where View Transitions are not supported, or under reduced motion, the link is an
// ordinary page load. Names are unique per page by construction (one per service id).
export const vt = {
  sheet: (id: string) => ({ viewTransitionName: `svc-${id}` }),
  obj: (id: string) => ({ viewTransitionName: `svc-obj-${id}` }),
  film: (slug: string) => ({ viewTransitionName: `film-${slug}` }),
}
