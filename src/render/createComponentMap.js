// Merge the kit's base component map with app-provided overrides/additions.
// App keys win, so an app can replace any base component or add its own.
export function createComponentMap(base, overrides = {}) {
  return { ...base, ...overrides };
}
